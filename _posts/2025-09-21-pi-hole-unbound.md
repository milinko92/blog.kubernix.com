---
layout: post
title: "Pi-hole & Unbound on Raspberry Pi"
date: 2025-09-21
image: /assets/img/pi-hole-unbound.jpg
tags: [pi-hole, unbound, raspberry pi, dns, homelab]
---

**Pi-hole + Unbound on Raspberry Pi 4 (Homelab Guide)**  
*Network-wide ad blocking with a validating, recursive, caching DNS resolver.*

## Introduction
This document walks through step-by-step installation of Pi-hole (DNS sinkhole and ad blocker) on a Raspberry Pi 4, together with Unbound as a local recursive and validating DNS resolver. This combination ensures privacy, speed, and reliability – without relying on external DNS providers.

## Required Hardware
- Raspberry Pi 4 (2–4 GB RAM recommended) + power supply  
- microSD (≥ 16 GB, A1/A2 class recommended)  
- Ethernet cable (more stable than Wi-Fi for DNS server)  
- Case + cooling (optional)

## Software Installation Steps
**Flash Raspberry Pi OS Lite (64‑bit)** using Raspberry Pi Imager. Enable SSH and set a hostname.

**First login and system update:**
```bash
sudo apt update && sudo apt full-upgrade -y
sudo reboot
```

**Set static IP address** (example in `dhcpcd.conf`):
```bash
sudo nano /etc/dhcpcd.conf

# Example (adjust to your network):
interface eth0
static ip_address=192.168.1.10/24
static routers=192.168.1.1
static domain_name_servers=127.0.0.1
```
> Note: For LAN DNS clients, the DHCP gateway should advertise this Pi-hole server's IP.

**Install Pi-hole (official installer):**
```bash
curl -sSL https://install.pi-hole.net | bash
```
During installation, select the interface (`eth0`), static IP, and temporary upstream DNS (e.g., Quad9). We will later switch to Unbound.

**Install Unbound:**
```bash
sudo apt install -y unbound
```
**Download root hints** (optional cron for monthly refresh):
```bash
sudo mkdir -p /var/lib/unbound
sudo wget -O /var/lib/unbound/root.hints https://www.internic.net/domain/named.root
# (Optional) monthly auto-refresh:
echo '0 3 1 * * root wget -qO /var/lib/unbound/root.hints https://www.internic.net/domain/named.root' | sudo tee /etc/cron.d/unbound-root-hints
```

## Configuration Steps
**Unbound configuration – create dedicated file:**
```bash
sudo nano /etc/unbound/unbound.conf.d/pi-hole.conf
```
```conf
server:
  verbosity: 0
  logfile: "/var/log/unbound/unbound.log"
  interface: 127.0.0.1
  port: 5335
  do-daemonize: no
  use-caps-for-id: no
  edns-buffer-size: 1232
  prefetch: yes
  qname-minimisation: yes
  harden-dnssec-stripped: yes
  harden-glue: yes
  harden-referral-path: yes
  aggressive-nsec: yes
  root-hints: "/var/lib/unbound/root.hints"
  cache-min-ttl: 3600
  cache-max-ttl: 86400
  msg-cache-size: 128m
  rrset-cache-size: 256m
  so-rcvbuf: 1m
  so-sndbuf: 1m
  access-control: 127.0.0.0/8 allow
```
**Check config and start service:**
```bash
sudo unbound-checkconf
sudo systemctl enable --now unbound
```

**Pi-hole → Upstream DNS = Unbound:**  
In `http://<IP-of-Pi>/admin` → **Settings** → **DNS** enable **Custom 1 (IPv4)** and set:
```
127.0.0.1#5335
```
Disable all other external upstream options so queries go only through Unbound.

**DNSSEC:** With Unbound as validator, you usually do **not** enable DNSSEC inside Pi-hole (Unbound already validates).

**Disable conflicting services on port 53 (if any):**
```bash
sudo systemctl disable --now systemd-resolved
```

## Verification / Tests
```bash
# Query Unbound directly
dig @127.0.0.1 -p 5335 example.com +dnssec +multi

# Query via Pi-hole (port 53)
dig @127.0.0.1 example.com +dnssec +multi

# Test DNSSEC validation
dig @127.0.0.1 -p 5335 dnssec-failed.org A +dnssec
# Expect SERVFAIL (validation works)
```

## Troubleshooting Tips
- **Port 53 in use?** Check: `sudo ss -tulpn | grep :53`. Stop or reconfigure the conflicting service.  
- **Unbound not starting?** Check logs: `sudo journalctl -u unbound -b`, and run `sudo unbound-checkconf`.  
- **Slow resolution?** Ensure `edns-buffer-size ≤ 1232` and MTU settings are correct (try 1500/1492).  
- **Pi-hole not blocking?** Update gravity: `pihole -g` and confirm LAN clients use the Pi-hole IP as DNS.  
- **DNSSEC problems?** Test with `dnssec-failed.org`. If all queries fail, temporarily disable DNSSEC in Pi-hole (keep Unbound validating).  
- **Outdated root hints?** Refresh manually or via cron job as shown above.

## Reference
Based on tutorial: *Crosstalk Solutions — The World’s Greatest Pi-hole + Unbound Tutorial (2023)*.
