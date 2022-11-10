// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict'
    if (typeof start !== 'number') {
      start = 0
    }

    if (start + search.length > this.length) {
      return false
    } else {
      return this.indexOf(search, start) !== -1
    }
  }
}

/** Safely access nested objects
 * // pass in your object structure as array elements
 * const name = getNestedObject(user, ['personalInfo', 'name']);
 * // to access nested array, just pass in array index as an element the path array.
 * const city = getNestedObject(user, ['personalInfo', 'addresses', 0, 'city']);
 * // this will return the city from the first address item.
 */
export const getNestedObject = (nestedObj: any, pathArr: any[]) => {
  return pathArr.reduce(
    (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
    nestedObj
  )
}

/**
 * Check if object is empty.
 * @param obj object to check
 */
export const isEmptyObject = (obj: any) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

/**
 * Check if object is empty.
 * @param obj object to check
 */
export const isEmptyArray = (obj: any[]) => {
  if (Array.isArray(obj)) {
    if (obj.length) {
      return false
    }
    return true
  } else {
    return false
  }
}

/**
 * Check if the array contains any element.
 * @param obj array to check
 */
export const isArrayWithData = (obj: any) => {
  return !!(Array.isArray(obj) && obj.length)
}

/**
 * Check if object or array is empty.
 * @param obj object/array to check
 */
export const isVeryEmpty = (obj: any) => {
  if (Array.isArray(obj)) {
    if (obj.length) {
      if (obj[0] && isEmptyObject(obj[0])) {
        return true
      } else if (!obj[0]) {
        return true
      }
    } else {
      return false
    }
  } else {
    if (obj && isEmptyObject(obj)) {
      return true
    } else if (!obj) {
      return true
    }
  }
  return false
}

/**
 * Check if object is not null or undefined.
 * @param obj object to check
 */
export const notNullOrUndefined = (obj: any) => {
  return obj !== null && obj !== undefined
}

/**
 * Check if object is truthy and return true or false.
 * @param obj object to check
 */
export const isTruthy = (obj: any) => {
  return obj ? true : false
}

/**
 * Get current full year.
 */
export function currentYear() {
  const d = new Date()
  return d.getFullYear()
}

/**
 * Finds all fields/properties in the form value object and removes them if null.
 * @param fData form data to clean
 * @param excludedFields exclude fields not to be cleaned
 */
export function cleanForm(fData: any, excludedFields?: any) {
  if (!excludedFields) {
    excludedFields = {}
  }
  for (const field in fData) {
    if (fData.hasOwnProperty(field) && !excludedFields.hasOwnProperty(field)) {
      // console.log('cleaning field', field);
      const fieldValue = fData[field]
      try {
        if (fieldValue === null) {
          delete fData[field]
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  return fData
}

/**
 * Transform object into its inner id, if any, otherwise return same object.
 * If object is array checks object elements in list.
 * @param obj generic object
 */
export function objectToId(obj: any) {
  if (obj && typeof obj === 'object' && obj.hasOwnProperty('id')) {
    obj = obj.id
  } else if (Array.isArray(obj) && obj.length) {
    obj = obj.map(v => {
      if (typeof v === 'object' && v.hasOwnProperty('id')) {
        return v.id
      } else {
        return v
      }
    })
  }
  return obj
}

/**
 * Check each object properties and transform their inner object into the id field, if any.
 * @param obj object with nested properties objects
 */
export function objectPropertiesToId(obj: any) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const propValue = obj[prop]
      obj[prop] = objectToId(propValue)
    }
  }
  return obj
}

export function mapArrayOfObjectsToArrayOfIds(objArray: any[]) {
  return objArray.map(obj => objectToId(obj))
}

export function mapArrayObjectsToId(objArray: any[]) {
  return objArray.map(obj => objectPropertiesToId(obj))
}

export function mapObjectObjectsToId(obj: any) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const propValue = obj[prop]
      obj[prop] = objectPropertiesToId(propValue)
    }
  }
  return obj
}

/**
 * Returns the mathematical average of a list of numbers.
 * @param list list of numbers
 */
export const average = (list: number[]) => {
  if (!isArrayWithData(list)) {
    console.log('No list provided for calculating average!')
    return 0
  }
  return list.reduce((p: number, c: number) => p + c) / list.length
}

/**
 * Sort an array of objects by the requested field.
 * @param array array to be sorted
 * @param fieldToSort field/property of the object chosen as sorting element
 */
export function sortArray(array: any[], fieldToSort: string) {
  if (isArrayWithData(array)) {
    return array.sort((a, b) =>
      a[fieldToSort] < b[fieldToSort] ? -1 : a[fieldToSort] > b[fieldToSort] ? 1 : 0
    )
  } else {
    return []
  }
}

/**
 * Filter an array of objects by the requested field for the value.
 * The match will return all values that include a part of the searched value.
 * @param array array of objects to be filtered
 * @param filterField field/property of the object chosen as filtering element
 * @param filterValue value to be matched by the filter
 */
export function filterArraySearch(
  array: any[],
  filterField: string,
  filterValue: any | undefined | null
) {
  if (isArrayWithData(array)) {
    if (filterValue) {
      try {
        return array.filter(o => o[filterField].toLowerCase().includes(filterValue.toLowerCase()))
      } catch (error) {
        console.log('error filtering search', error)
      }
    } else {
      return array
    }
  } else {
    return []
  }
}

/**
 * Filter an array of objects by the requested field for the value.
 * Field must be an exact match.
 * @param array array of objects to be filtered
 * @param filterField field/property of the object chosen as filtering element
 * @param filterValue value to be matched by the filter
 */
export function filterArray(
  array: any[],
  filterField: string,
  filterValue: any | undefined | null
) {
  if (isArrayWithData(array)) {
    if (filterValue) {
      return array.filter(o => o[filterField] === filterValue)
    } else {
      return array
    }
  } else {
    return []
  }
}

export function comparer(a: any, b: any) {
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Search for the object in the array and return if object is in the array.
 * @param obj object to search
 * @param array array where the object could be
 */
export function isIn(obj: any, array: any[]) {
  if (!obj || !array) {
    return
  }
  if (array.indexOf(obj) !== -1) {
    return true
  } else {
    return false
  }
}
