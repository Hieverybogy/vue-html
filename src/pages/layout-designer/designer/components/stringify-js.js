
/**
 * 参考JSON v3.3.2调整stringify方法
 * add by zhangmq 2020-05-12
 */
const objectTypes = {
    'function': true,
    'object': true
}

// Convenience aliases.
const objectProto = Object.prototype
const getClass = objectProto.toString
const isProperty = objectProto.hasOwnProperty

// Internal: Contains `try...catch` logic used by other functions.
// This prevents other functions from being deoptimized.
function attempt(func, errorFunc) {
    try {
        func();
    } catch (exception) {
        if (errorFunc) {
            errorFunc();
        }
    }
}

// Test the `Date#getUTC*` methods. Based on work by @Yaffle.
var isExtended = new Date(-3509827334573292);
attempt(function () {
    // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
    // results for certain dates in Opera >= 10.53.
    isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
});

    // Common `[[Class]]` name aliases.
const functionClass = "[object Function]"
const dateClass = "[object Date]"
const numberClass = "[object Number]"
const stringClass = "[object String]"
const arrayClass = "[object Array]"
const booleanClass = "[object Boolean]"

// Internal: Normalizes the `for...in` iteration algorithm across
// environments. Each enumerated key is yielded to a `callback` function.
var forOwn = function (object, callback) {
    var size = 0, Properties, dontEnums, property;

    // Tests for bugs in the current environment's `for...in` algorithm. The
    // `valueOf` property inherits the non-enumerable flag from
    // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
    (Properties = function () {
        this.valueOf = 0;
    }).prototype.valueOf = 0;

    // Iterate over a new instance of the `Properties` class.
    dontEnums = new Properties();
    for (property in dontEnums) {
        // Ignore all properties inherited from `Object.prototype`.
        if (isProperty.call(dontEnums, property)) {
            size++;
        }
    }
    Properties = dontEnums = null;

    // Normalize the iteration algorithm.
    if (!size) {
        // A list of non-enumerable properties inherited from `Object.prototype`.
        dontEnums = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
        // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
        // properties.
        forOwn = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
                // Gecko <= 1.0 enumerates the `prototype` property of functions under
                // certain conditions; IE does not.
                if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                    callback(property);
                }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = dontEnums.length; property = dontEnums[--length];) {
                if (hasProperty.call(object, property)) {
                    callback(property);
                }
            }
        };
    } else {
        // No bugs detected; use the standard `for...in` algorithm.
        forOwn = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
                if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                    callback(property);
                }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
                callback(property);
            }
        };
    }
    return forOwn(object, callback);
};

// Internal: A map of control characters and their escaped equivalents.
var Escapes = {
    92: "\\\\",
    34: '\\"',
    8: "\\b",
    12: "\\f",
    10: "\\n",
    13: "\\r",
    9: "\\t"
};

// Internal: Converts `value` into a zero-padded string such that its
// length is at least equal to `width`. The `width` must be <= 6.
var leadingZeroes = "000000";
var toPaddedString = function (width, value) {
    // The `|| 0` expression is necessary to work around a bug in
    // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
    return (leadingZeroes + (value || 0)).slice(-width);
};

// Internal: Serializes a date object.
var serializeDate = function (value) {
    var getData, year, month, date, time, hours, minutes, seconds, milliseconds;
// Define additional utility methods if the `Date` methods are buggy.
    if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
            return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
        getData = function (value) {
            // Manually compute the year, month, date, hours, minutes,
            // seconds, and milliseconds if the `getUTC*` methods are
            // buggy. Adapted from @Yaffle's `date-shim` project.
            date = floor(value / 864e5);
            for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
            for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
            date = 1 + date - getDay(year, month);
            // The `time` value specifies the time within the day (see ES
            // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
            // to compute `A modulo B`, as the `%` operator does not
            // correspond to the `modulo` operation for negative numbers.
            time = (value % 864e5 + 864e5) % 864e5;
            // The hours, minutes, seconds, and milliseconds are obtained by
            // decomposing the time within the day. See section 15.9.1.10.
            hours = floor(time / 36e5) % 24;
            minutes = floor(time / 6e4) % 60;
            seconds = floor(time / 1e3) % 60;
            milliseconds = time % 1e3;
        };
    } else {
        getData = function (value) {
            year = value.getUTCFullYear();
            month = value.getUTCMonth();
            date = value.getUTCDate();
            hours = value.getUTCHours();
            minutes = value.getUTCMinutes();
            seconds = value.getUTCSeconds();
            milliseconds = value.getUTCMilliseconds();
        };
    }
    serializeDate = function (value) {
        if (value > -1 / 0 && value < 1 / 0) {
            // Dates are serialized according to the `Date#toJSON` method
            // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
            // for the ISO 8601 date time string format.
            getData(value);
            // Serialize extended years correctly.
            value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                // Months, dates, hours, minutes, and seconds should have two
                // digits; milliseconds should have three.
                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                // Milliseconds are optional in ES 5.0, but required in 5.1.
                "." + toPaddedString(3, milliseconds) + "Z";
            year = month = date = hours = minutes = seconds = milliseconds = null;
        } else {
            value = null;
        }
        return value;
    };

    return serializeDate(value);
};

// Internal: Double-quotes a string `value`, replacing all ASCII control
// characters (characters with code unit values between 0 and 31) with
// their escaped equivalents. This is an implementation of the
// `Quote(value)` operation defined in ES 5.1 section 15.12.3.
var unicodePrefix = "\\u00";
var escapeChar = function (character) {
    var charCode = character.charCodeAt(0), escaped = Escapes[charCode];
    if (escaped) {
        return escaped;
    }
    return unicodePrefix + toPaddedString(2, charCode.toString(16));
};
var reEscape = /[\x00-\x1f\x22\x5c]/g;
var quote = function (value, useQuate = true) {
    reEscape.lastIndex = 0;
    return (useQuate ? '"' : '') +
        (
            reEscape.test(value)
            ? value.replace(reEscape, escapeChar)
            : value
        ) +
        (useQuate ? '"' : '');
};

// Internal: Recursively serializes an object. Implements the
// `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
var serialize = function (property, object, callback, properties, whitespace, indentation, stack, prePathChain) {
    var value, type, className, results, element, index, length, prefix, result, useQuate, quateObj, pathChain;
    pathChain = (prePathChain || '') + (typeof property === 'number' ? ('[' + property + ']') : (property ? (prePathChain ? '.' : '') + property : ''))
    attempt(function () {
        // Necessary for host object support.
        value = object[property];
    });
    if (typeof value == "object" && value) {
        if (value.getUTCFullYear && getClass.call(value) == dateClass && value.toJSON === Date.prototype.toJSON) {
            value = serializeDate(value);
        } else if (typeof value.toJSON == "function") {
            value = value.toJSON(property);
        }
    }
    if (callback) {
        // add by zhangmq 2020-05-12 格式化函数配置项时用到，返回不应该用双引号括起来
        quateObj = { useQuate: true }
        // If a replacement function was provided, call it to obtain the value
        // for serialization.
        value = callback.call(object, property, value, quateObj, pathChain);
        useQuate = quateObj.useQuate
    }
    // Exit early if value is `undefined` or `null`.
    if (value == undefined) {
        return value === undefined ? value : "null";
    }
    type = typeof value;
    // Only call `getClass` if the value is an object.
    if (type == "object") {
        className = getClass.call(value);
    }
    switch (className || type) {
        case "boolean":
        case booleanClass:
            // Booleans are represented literally.
            return "" + value;
        case "number":
        case numberClass:
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
        case "string":
        case stringClass:
            // Strings are double-quoted and escaped.
            return quote("" + value, useQuate);
    }
    // Recursively serialize objects and arrays.
    if (typeof value == "object") {
        // Check for cyclic structures. This is a linear search; performance
        // is inversely proportional to the number of unique nested objects.
        for (length = stack.length; length--;) {
            if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
            }
        }
        // Add the object to the stack of traversed objects.
        stack.push(value);
        results = [];
        // Save the current indentation level and indent one additional level.
        prefix = indentation;
        indentation += whitespace;
        if (className == arrayClass) {
            // Recursively serialize array elements.
            for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack, pathChain);
                results.push(element === undefined ? "null" : element);
            }
            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
        } else {
            // Recursively serialize object members. Members are selected from
            // either a user-specified list of property names, or the object
            // itself.
            forOwn(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack, pathChain);
                if (element !== undefined) {
                    // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                    // is not the empty string, let `member` {quote(property) + ":"}
                    // be the concatenation of `member` and the `space` character."
                    // The "`space` character" refers to the literal space
                    // character, not the `space` {width} argument provided to
                    // `JSON.stringify`.
                    results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
            });
            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
        }
        // Remove the object from the traversed object stack.
        stack.pop();
        return result;
    }
};

// Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
export function stringifyJs (source, filter, width) {
    var whitespace, callback, properties, className;
    if (objectTypes[typeof filter] && filter) {
        className = getClass.call(filter);
        if (className == functionClass) {
            callback = filter;
        } else if (className == arrayClass) {
            // Convert the property names array into a makeshift set.
            properties = {};
            for (var index = 0, length = filter.length, value; index < length;) {
                value = filter[index++];
                className = getClass.call(value);
                if (className == "[object String]" || className == "[object Number]") {
                    properties[value] = 1;
                }
            }
        }
    }

    if (width) {
        className = getClass.call(width);
        if (className == numberClass) {
            // Convert the `width` to an integer and create a string containing
            // `width` number of space characters.
            if ((width -= width % 1) > 0) {
                if (width > 10) {
                    width = 10;
                }
                for (whitespace = ""; whitespace.length < width;) {
                    whitespace += " ";
                }
            }
        } else if (className == stringClass) {
            whitespace = width.length <= 10 ? width : width.slice(0, 10);
        }
    }

    // Opera <= 7.54u2 discards the values associated with empty string keys
    // (`""`) only if they are used directly within an object member list
    // (e.g., `!("" in { "": 1})`).
    return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
}
