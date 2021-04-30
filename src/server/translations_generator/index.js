import { google } from 'googleapis'
import { /* flatten, */ unflatten } from 'flat'
import fs from 'fs-extra'
import { readTranslationsFromGoogleSheets } from '../../../src/client/configs/sampo/GeneralConfig'
// import localeEN from '../../client/translations/sampo/localeEN'

const auth = new google.auth.GoogleAuth({
  keyFile: 'src/server/translations_generator/credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const sheets = google.sheets({ version: 'v4', auth })

const spreadsheetId = ''

// const writeToGoogleSheet = async values => {
//   try {
//     const result = await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: 'A:B',
//       valueInputOption: 'RAW',
//       requestBody: {
//         values
//       }
//     })
//     console.log(result)
//   } catch (error) {
//     console.error(error.errors)
//   }
// }

const readFromGoogleSheet = async () => {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A:B'
    })
    return result.data.values
  } catch (error) {
    console.error(error.errors)
  }
}

const writeToFile = async (path, data) => {
  const json = JSON.stringify(data, null, 2)

  try {
    await fs.writeFile(path, json)
    console.log('Saved data to file.')
  } catch (error) {
    console.error(error)
  }
}

const sheetValuesToFlatObject = values => {
  return values.reduce((result, item, index) => {
    result[item[0]] = item[1]
    return result
  }, {})
}

// const flattened = flatten(localeEN)

// Object.keys(flattened).forEach(key => {
//   // Change all groups of white-spaces characters to a single space in the whole string.
//   // Then trim() the result to remove all exceeding white-spaces before and after the text.
//   flattened[key] = flattened[key].trim().replace(/\s+/g, ' ')
// })

// const values = []

// for (const [key, value] of Object.entries(flattened)) {
//   values.push([key, value])
// }

// writeToFile('test.json', unflattenedObject)
// console.log(values)
// writeToGoogleSheet(values)
if (readTranslationsFromGoogleSheets) {
  readFromGoogleSheet().then(data => {
    const flatObject = sheetValuesToFlatObject(data)
    writeToFile('src/client/translations/sampo/localeEN.json', unflatten(flatObject))
  })
}
