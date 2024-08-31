'use strict';

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

// ['a','b'] => {a:1,b:1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

// ['a','b'] => {a:0,b:0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

/**
    a = { b: null, c: 123}
    => a = { c: 123}
 */

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object')
            removeUndefinedObject(obj[key]);
        else if (obj[key] === null) delete obj[key];

        if (Array.isArray(obj[key])) {
            let newArray = obj[key].filter((e) => {
                return e !== null;
            });
            obj[key] = newArray;
        }
    });
    return obj;
};

/*
    { a: 1, b: { c: 2, d: { e: 3 } } }
    => { a: 1, 'b.c': 2, 'b.d.e': 3 }

*/

const updateNestedObjectParser = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(obj[key]).forEach((a) => {
                final[`${key}.${a}`] = response[a];
            });
        } else {
            final[key] = obj[key];
        }
    });
};

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
};
