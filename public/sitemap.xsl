<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Rajwadi Rajputi Poshak</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #2D241E;
            background-color: #FDFBF7;
            margin: 0;
            padding: 24px;
          }
          .container {
            max-width: 1060px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            overflow: hidden;
            border: 1px solid #E8DFD5;
          }
          .header {
            background: linear-gradient(135deg, #7A1C28 0%, #4A0E17 100%);
            color: #ffffff;
            padding: 28px 32px;
          }
          .header h1 {
            margin: 0 0 8px 0;
            font-size: 24px;
            letter-spacing: 0.5px;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 14px;
          }
          .info-bar {
            background: #F8F1E7;
            padding: 14px 32px;
            font-size: 13px;
            color: #6B5B4D;
            border-bottom: 1px solid #E8DFD5;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            background: #FAF6F0;
            text-align: left;
            padding: 12px 20px;
            font-weight: 600;
            color: #4A3E35;
            border-bottom: 1px solid #E8DFD5;
          }
          td {
            padding: 12px 20px;
            border-bottom: 1px solid #F0EAE1;
            word-break: break-all;
          }
          tr:hover td {
            background-color: #FAF7F2;
          }
          a {
            color: #8C1D2F;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .muted {
            color: #8C827A;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👑 Rajwadi Rajputi Poshak — XML Sitemap</h1>
            <p>Official Search Engine Index Map | <a href="https://www.rajwadirajputiposhak.com" style="color: #F8D794; font-weight: 600;">rajwadirajputiposhak.com</a></p>
          </div>
          <div class="info-bar">
            <span>Total URLs: <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong></span>
            <span>Optimized for Google Search Console</span>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 70%;">URL</th>
                <th style="width: 30%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:lastmod">
                        <xsl:value-of select="sitemap:lastmod"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="muted">—</span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
