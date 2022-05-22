/*
Javascript native prototyping is NOT RECOMENDED
We are not building a public library, so do it.

@see:
https://stackoverflow.com/questions/6877005/extending-object-prototype-javascript
*/
// Array.prototype.equal = function (b) {
//     var a = this;
//     if (a === b) return true;
//     if (a == null || b == null) return false;
//     if (a.length != b.length) return false;

//     // If you don't care about the order of the elements inside
//     // the array, you should sort both arrays here.
//     // Please note that calling sort on an array will modify that array.
//     // you might want to clone your array first.

//     for (var i = 0; i < a.length; ++i) {
//         if (a[i] !== b[i]) return false;
//     }
//     return true;
// }
String.prototype.replaceTurkish = function () {
    return this
        .replace(/Ğ/g, "G").replace(/Ü/g, "U").replace(/Ş/g, "S")
        .replace(/ı/g, "i").replace(/İ/g, "I").replace(/Ö/g, "O")
        .replace(/Ç/g, "C").replace(/ğ/g, "g").replace(/ü/g, "u")
        .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o")
        .replace(/ç/g, "c");
}

if (!('toJSON' in Error.prototype))
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            var alt = {};

            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });