# Portal Config

The `protalConfig.js` file is the entry point of your sampo config. In here you define all the different perspectives your app has, as well as some layout of your front page. (Note that all manner of layout and styling config in here will be moved to css in future versions). 

A lot of the config options in here are remnants of older sampo projects that do not really fit into the generic model for version 4 onwards. These will be removed in future versions. Only the important config options are described here. It can happen that sampo will not run without a value passed for some of these legacy configs, in those cases simply use a default value as in the example configs here.

## Content config

``"portalID": "sampo",`` the portalID essentially defines which config directory sampo will read and use. 

---

``"staticsUrl": "",`` with a staticsUrl you can define a different url where sampo should look for your statics such as images and icons. If set to nothing sampo will look for them under `<portalID>/assets/`.

---

```
"perspectives": {
    "searchPerspectives": [
        "corporations",
        "securities",
        "infoPage"
    ],
    "onlyInstancePages": [
        "corporationNames",
        "legalForms",
        "addresses"
    ]
},
```
The perspectives config defines all the search perspectives you want to use and by default display in your topbar. Perspectives that are only instance pages also need to be listed here.

---

```
"localeConfig": {
    "defaultLocale": "en",
    "availableLocales": [
        {
            "id": "en",
            "label": "English",
            "filename": "localeEN.json"
        },
        {
            "id": "nl",
            "label": "Nederlands",
            "filename": "localeNL.json"
        }
    ]
},
```
Here you define the different locales your app uses. Each locale will have its own json file in which you define all the text content of your portal.

---

### Layout config
Note that this layout config will likely significantly change in version 5, but for now this is how it works.
```
"layoutConfig": {
  ...
}
```
Under the layoutConfig object you will define everything to do with the layout of your landing page.

```
"customCssFile": "custom.css",
```
A custom css file can be provided that will override default styling. It is recommended to use this over defining color palette etc in the `portalConfig.json` file as ideally styling should not be part of the json, but it is still possible for now as seen below.

```
"colorPalette": {
    "primary": {
        "main": "#2a2521"
    },
    "secondary": {
        "main": "#9e1b1e"
    }
},
"hundredPercentHeightBreakPoint": 900,
"reducedHeightBreakpoint": 1920,
"tabHeight": 58,
"paginationToolbarHeight": 37,
"tableFontSize": "0.8rem",
```

---

```
"topBar": {
    "showSearchField": false,
    "logoImage": "",
    "logoTextTransform": "none",
    "hideLogoTextOnMobile": true,
    "showLanguageButton": true,
    "showFeedbackButton": false,
    "externalInstructions": false,
    "externalAboutPage": false,
    "reducedHeight": 48,
    "defaultHeight": 64,
    "mobileMenuBreakpoint": 1360,
    "infoDropdown": [
        {
            "id": "infoPage",
            "externalLink": false,
            "translatedText": "infoPage",
            "internalLink": "/info"
        },
        ...
    ]
},
```
The topbar also has a bunch of styling options that will be removed in version 5.
What is important however is `infoDropdown` where you can define what pages to display in the info dropdown on the right side of the topbar. You can define these pages yourself in your locales (see [locales](./Locales.md)).

---

```
"mainPage": {
    "bannerImage": "main_page/mmm-banner.jpg",
    "bannerBackground": "#f3eee3",
    "bannerMobileHeight": 150,
    "bannerReducedHeight": 220,
    "bannerDefaultHeight": 300,
    "wrapSubheading": true,
    "perspectives": [
        {
            "id": "part1",
            "cardsPerRow": 2,
            "perspectives": [
                "corporations",
                "securities"
            ]
        }
    ]
},
```
For the main part of the landing page what perspectives to show where can be defined. In locales again headers and texts can be set.

---

```
"footer": {
    "reducedHeight": 54,
    "defaultHeight": 64,
    "images": [
        {
            "id": "ugent",
            "image": "logos/ugent.webp",
            "href": "https://www.ugent.be/en",
            "alt": "Ghent University logo",
            "width": 55,
            "height": 44
        },
        ...
    ]
}
```

In the footer sampo by default supports putting whatever images with href you want. Again custom css could be used if more customisation is needed.

