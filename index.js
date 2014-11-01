/*!
 * preserve <https://github.com/jonschlinkert/preserve>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Pass the `regex` pattern for the tokens you want to preserve
 * in `string`, Run `fn` on `string` then put the orginal tokens
 * back before returning the string.
 *
 * ```js
 * var fn = require('js-beautify').html;
 * console.log(tokens(/<%=\s*[^>]+%>/g, '<div><%= name %></div>', fn);
 * ```
 * Results in something like:
 *
 * ```html
 * <div>
 *   <%= name %>
 * </div>
 * ```
 *
 * @param  {String} `re` Regex for matching tokens.
 * @param  {String} `str` String with tokens to preserve.
 * @param  {Function} `fn` The function to run on `string`.
 * @return {String}
 * @api public
 */

function preserve(re, str, fn) {
  var tokens = new Tokens(re);
  str = tokens.before(str);
  str = fn(str);
  return tokens.after(str);
}

module.exports = preserve;

/**
 * Expose `preserve.Tokens`
 */

module.exports.Tokens = Tokens;

/**
 * If you'd rather use the API directly, create an instance
 * of `Tokens`, passing the `regex` for the tokens you wish to
 * preserve to the constructor.
 *
 * ```js
 * var preserve = require('preserve');
 * var tokens = new preserve.Tokens(/<%=\s*[^>]+%>/g);
 * ```
 *
 * @param {RegExp} `re` Matching regex for the tokens you want to preserve.
 * @api public
 */

function Tokens(re) {
  this.cache = {};
  this.re = re;
}

/**
 * Generate a temporary ID as a heuristic for tokens.
 *
 * @param  {Number} `num`
 * @return {String}
 * @api private
 */

Tokens.prototype.makeId = function(num) {
  return '__ID' + num + '__';
};

/**
 * Replace tokens in `str` with a temporary, heuristic placeholder.
 *
 * ```js
 * tokens.before('<div><%= name %></div>');
 * //=> '<div>__ID1__</div>'
 * ```
 *
 * @param  {String} `str`
 * @return {String} String with placeholders.
 * @api public
 */

Tokens.prototype.before = function(str) {
  var tokens = this;
  return str.replace(this.re, function (match, i) {
    tokens.cache[i] = match;
    return tokens.makeId(i);
  });
};

/**
 * Replace placeholders in `str` with original tokens.
 *
 * ```js
 * tokens.after('<div>__ID1__</div>');
 * //=> '<div><%= name %></div>'
 * ```
 *
 * @param  {String} `str` String with placeholders
 * @return {String} `str` String with original tokens.
 * @api public
 */

Tokens.prototype.after = function(str) {
  var re = /__ID(\d+)__/g;
  var tokens = this;
  return str.replace(re, function (_, id) {
    return tokens.cache[id];
  });
};
