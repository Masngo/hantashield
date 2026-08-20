import feedparser

def fetch_global_health_alerts():
    alerts = []
    try:
        # WHO Disease Outbreak News (DON) RSS feed
        who_feed = feedparser.parse("https://www.who.int/feeds/entity/csr/don/en/rss.xml")
        for entry in who_feed.entries[:5]:
            alerts.append({
                "source": "WHO",
                "title": getattr(entry, 'title', 'Outbreak Notice'),
                "link": getattr(entry, 'link', 'https://www.who.int'),
                "published": getattr(entry, 'published', 'Recent'),
                "summary": getattr(entry, 'summary', 'Global health event bulletin.')
            })
    except Exception as e:
        print(f"Error fetching WHO feed: {e}")

    return alerts
