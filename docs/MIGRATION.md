# Migrating from v3 to v4

The architecture of Sampo-UI has changed in the new major v4 version. Now all of the portal-specific configuration files are stored in a separate `configs` folder instead of being present in also both `client` and `server` directories.

The new architecture consists of the following directories:

* client
* **configs**
* **custom_components**
* server
* docs

`client` and `server` are now separate from each other with their own `package.json` files. This should make it easier to upgrade dependencies. 

The directories listed in bold in the list are the relevant directories for configuring new portals or adding new components. If you use an existing image of the base Sampo-UI code, you can just include the `configs` and `custom_components` (if you have any, otherwise this can be skipped) folders alongside your `.env` (see `example.env`) and compose files (see `compose.yaml` and `compose-prod.yaml`).

## `configs` structure

The structure of this folder should be the following:

```
configs/
- sampo/ [or whatever your portal ID is]
    - assets/
        - logos/
            - logo.png
            - [any other logo images]
        - main_page/
            - [any banner and card images]
        - [any other assets, e.g., icons or custom CSS]
    - only_instance_pages/
        - [any instance only perspective configuration files, e.g., manuscripts.json]
    - search_perspectives/
        - [any perspective configuration files, e.g., perspective1.json]
    - sparql_queries/
        - SparqlQueriesPrefixes.js
        - SparqlQueriesFullTextSearch.js
        - [any perspective query files, e.g., SparqlQueriesPerspective1.js]
    - [optional] pages/
        - [any HTML page files]
    - translations/
        - localeEN.json
        - localeFI.json
        - [any other translation files]
    - [optional] filters.js
    - [optional] mappers.js
- portalConfig.json
- [optional] robots.txt
- [optional] index.html
```

## Previous configuration file locations

The files you will need to copy into the new `configs` folder are as follows:

(format: `old_location` &rarr; `new_location`)

### Portal configuration

`src/configs/portalConfig.json` &rarr; `configs/portalConfig.json`

### Perspective configurations 

#### Full perspectives

`src/configs/sampo/search_perspectives/*.json` &rarr; `configs/sampo/search_perspectives/*.json` 

Copy all files within the folder to the new one. 

**Your original folder name might differ from `sampo` if you've changed the portal ID in your portal configuration.** In this case also adjust the folder name in the new `configs` folder to match this. This same instruction will apply to all the following file locations as well.

#### Perspectives consisting only of instance pages

`src/configs/sampo/only_instance_pages/*.json` &rarr; `configs/sampo/only_instance_pages/*.json` 

Copy all files within the folder to the new one. 

### Translations

`src/client/translations/sampo/*.json` &rarr; `configs/sampo/translations/*.json`

Copy all files within the folder to the new one.

### SPARQL queries

`src/server/sparql/sampo/sparql_queries/*.js` &rarr; `configs/sampo/sparql_queries/*.js`

Copy all files within the folder to the new one.

### Assets

#### Logos

`src/client/img/logos/*` &rarr; `configs/sampo/assets/logos/*`

Copy all files within the folder to the new one.

#### Main page assets

`src/client/img/main_page/*` &rarr; `configs/sampo/assets/main_page/*`

Copy all files within the folder to the new one.

## Changes made to `Main.js` / `MainCard.js` / `Footer.js`

If you have made changes to `src/client/components/perspectives/sampo/Main.js` (or `MainCard.js` / `Footer.js`) to change their layout, you should now do this in `portalConfig.json` instead following [these instructions](https://github.com/GhentCDH/sampo-ui/wiki/Customise-Layout). If some of your changes cannot be replicated with the new layout options, please see section about replacing specific client files.

## Custom components

If you have created new components that are not part of the base Sampo-UI code, you can now include them using the `custom_components` directory (separate from `configs`). See [instructions here](https://github.com/SemanticComputing/sampo-ui/blob/dev-v4/docs/pages/CustomComponents.md).

## Replacing specific client files

If you have made changes that custom components cannot cover, you can replace specific client files with the help of [webpack](https://webpack.js.org/). **This will however require you to either build a new image with the base Sampo-UI code as the base or rebuild an existing image (which still has all the client files) after adding your replacement files.** webpack will first check for files from a directory called `custom` before `src`:

```
resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'custom'),
      path.resolve(__dirname, 'src')
    ]
  },
```

So, for example, if you wanted to replace the code for `ResultClassRoute` located in `client/src/components/facet_results/ResultClassRoute.js`, you would need to have the new file with the same path from `components` onward: `client/custom/components/facet_results/ResultClassRoute.js`.

Concretely, you could have a folder stored with your `configs` and `custom_components` folders that you copy into your client build's `client` folder before running `npm run build`. As long as it's present before webpack builds, webpack will resolve the references to `ResultClassRoute` to your custom version.