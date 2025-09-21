---
layout: default
title: Tags
permalink: /tags/
---

<div class="card">
  <h1>Tags</h1>
  <p>Browse projects by tag.</p>
</div>

{% assign tags_sorted = site.tags | sort %}
{% for tag in tags_sorted %}
  {% assign tag_name = tag[0] %}
  {% assign posts = tag[1] %}
  {% assign slug = tag_name | downcase | replace: ' ', '-' %}
  <section class="card" id="{{ slug }}">
    <h2>{{ tag_name }}</h2>
    <ul>
      {% for post in posts %}
        <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <span class="post-meta">— {{ post.date | date: "%b %d, %Y" }}</span></li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}
