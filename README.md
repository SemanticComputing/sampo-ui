[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
# Sampo-UI

A framework for building user interfaces for semantic portals.

## Running development and production

### Development

Copy the content of `example.env` into your own `.env` file.

Then run:

```
docker compose up
```
to run both client and server in development mode.

Make a copy of `compose.yaml` and edit the mounted volumes to point to your configs and run that to test in development mode.

Configs need to be mounted on server while custom components need to be mounted to client.


### Production

To build client, server and combo images run:
```bash
docker compose -f compose-prod.yaml build 
```

Sampo can be run as split client and server containers where the `API_URL` of the server can be set. The combo image can
be used to run sampo as one container where the server is hosted on `/api`.

## Documentation

[docs page](docs/README.md)

## Developer guide

### Coding style

The [JavaScript style guide, linter, and formatter](https://standardjs.com) module (named "standard" in package.json) is installed by 
default as development dependency. Do not install or create any additional style definitions or configurations. 
Instead, install an appropriate [plugin](https://standardjs.com/index.html#are-there-text-editor-plugins) for your text editor. If there are no plugins  available for your favorite 
editor, it is highly recommended to switch into a supported editor.

## Version 3.0.0 vs v4.0.0 onwards
Version 4 is a very major refactoring update that changed the way sampo portals get built. See docs page for more info.

The following research prototype portals used sampo version 3 or earlier as a base:

1. [NameSampo](https://github.com/SemanticComputing/nimisampo.fi)
2. [Mapping Manuscript Migrations](https://github.com/mapping-manuscript-migrations/mmm-web-app)
3. [WarVictimSampo 1914&ndash;1922](https://github.com/SemanticComputing/sotasurmat-web-app)
4. [LawSampo](https://github.com/SemanticComputing/lawsampo-web-app)
5. [AcademySampo](https://github.com/SemanticComputing/academysampo-web-app)
6. [FindSampo](https://github.com/SemanticComputing/findsampo-web-app)
7. [HistorySampo](https://github.com/SemanticComputing/historysampo-web-app)
8. [LetterSampo](https://github.com/SemanticComputing/lettersampo-web-app)
9. [Hellerau](https://github.com/SemanticComputing/hellerau-web-app)
10. [ParliamentSampo](https://github.com/SemanticComputing/parliamentsampo-web-app)
11. [WarMemoirSampo](https://github.com/SemanticComputing/veterans-web-app)
12. [WarSampo analyzer](https://github.com/SemanticComputing/warsa-analyzer-web-app)
13. [ArtSampo](https://github.com/SemanticComputing/artsampo-web-app)
14. [Constellations of Correspondence](https://github.com/SemanticComputing/coco-web-app)
15. [BookSampo](https://github.com/SemanticComputing/booksampo-web-app)

## Extra: forking into the same organization account

In GitHub it's not possible to fork an organization's repository to that same organization. If a new repository needs to be created
using the *SemanticComputing* organization account, here is an alternative workflow for forking:

1. Clone this repository:
`git clone git@github.com:SemanticComputing/sampo-ui.git`

2. Set up a new GitHub repository. Do not initialize it with anything. It needs to be an empty repository.
You can name it how you like and you can rename your local folder to match that.

3. Copy the url of your new repository.

4. With terminal go to the folder with the clone of this repository (*sampo-ui*).

5. Change remote origin from *sampo-ui* to your new repository:
`git remote set-url origin [your new github repo here]`

6. Check that the origin changed to your new repository:
`git remote -v`

7. Push your local clone of *sampo-ui* to your new repository:
`git push`

8. Set *sampo-ui* as the upstream of your new repository:
`git remote add upstream git@github.com:SemanticComputing/sampo-ui.git`

9. When new commits appear on the *sampo-ui* repository you can fetch them to your new repository.
The example fetches only master branch:
`git fetch upstream master`

10. Go to the branch of your new repository where you want to merge the changes in upstream.
Merge, solve conflicts and enjoy:
`git merge upstream/master`

## Credits

Developed by the [Semantic Computing Research Group (SeCo)](https://seco.cs.aalto.fi/) and the [Ghent Centre for Digital Humanities (GhentCDH)](https://www.ghentcdh.ugent.be/).

Funded by [FIN-CLARIAH](https://www.kielipankki.fi/organization/fin-clariah/) and [Clariah-VL](https://clariahvl.hypotheses.org/).

Supported by [CSC – IT Center for Science](https://csc.fi/en/).

<img src="https://www.ldf.fi/img/seco-logo.png" alt="SeCo logo" width="300">

<img src="https://www.ghentcdh.ugent.be/ghentcdh_logo_blue_text_transparent_bg_landscape.svg" alt="GhentCDH logo" width="400">

<img src="https://www.kielipankki.fi/wp-content/uploads/FIN-CLARIN_logo_2016_transparent.png" alt="FIN-CLARIN logo" width="400">

<img src="https://seco.cs.aalto.fi/projects/fin-clariah/dariah_logo.png" alt="DARIAH-FI logo" width="400">

<img src="https://www.ghentcdh.ugent.be/sites/default/files/clariah_small.jpg" alt="CLARIAH-VL logo" width="400">