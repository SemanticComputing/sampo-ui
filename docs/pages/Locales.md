# Locales

Locale config files are json config where the actual text content of the portal is written. A locale.json must be made
per language the portal uses. 

Each entry in this json file refers to some ID defined either in config or in sampo core.

## General entries
The upper half of the example locale files in this repository (up until `perspectives`) contains some general locale config
that most portals will use. It is fine to copy this and edit the text to fit your portal or remove parts you do not need.


## Properties
In the `perspectives` object the text for facets and table columns gets defined. The most important thing to know here is that the same text gets used for column and facet labels and descriptions for the matching properties.

## Text pages

### Info dropdown
All pages defined in the `infoDropdown` in `portalConfig.json` must have their page content defined in locales.

For example:
```
"infoDropdown": [
    {
        "id": "about",
        "externalLink": false,
        "translatedText": "aboutPage",
        "internalLink": "/about"
    }
]
```
must in the root of locales have something like:
```
"aboutPage": "htmlFile:pages/about_en.html"
```
and then put the actual content of the page in said html file. The content can also be put directly in the locale json as a string, but since that gets very dirty for large pages it is not recommended.


### Dummy internal perspectives
The above part can only put these pages in the info dropdown. It is also possible to add them as perspectives, meaning 
they appear as their own button in the topbar and can have a card on the front page.

To define that make a new perspective json file under ``search_perspectives`` and structure it like this:
```
{
    "id": "about",
    "searchMode": "dummy-internal",
    "internalLink": "/about",
    "hideTopPerspectiveButton": false
}
```
Then also add it in `portalConfig.json` as if it were a normal perspective.
