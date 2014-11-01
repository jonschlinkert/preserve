/*!
 * preserve <https://github.com/jonschlinkert/preserve>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Create an instance of `Tokens` with a `regex` for the tokens you
 * wish to preserve.
 *
 * ```js
 * var Tokens = require('preserve');
 * var tokens = new Tokens(/<%=\s*[^>]+%>/g);
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
  var i = 0;

  return str.replace(this.re, function (match) {
    var id = i++;
    tokens.cache[id] = match;
    return tokens.makeId(id);
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

/**
 * Expose `preserve.Tokens`
 */

module.exports = Tokens;
