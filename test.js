/*!
 * preserve <https://github.com/jonschlinkert/preserve>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var assert = require('assert');
var should = require('should');
var tokens = require('./');

var re = /<%=\s*[^>]+%>/g;
var fn = function(str) {
  return require('js-beautify').html(str, {
    indent_char: ' ',
    indent_size: 2,
  });
};

describe('preserve tokens', function () {
  it('should (e.g. shouldn\'t, but will) mangle tokens in the given string', function () {
    var html = fn('<ul><li><%= name %></li></ul>');
    html.should.equal('<ul>\n  <li>\n    <%=n ame %>\n  </li>\n</ul>');
  });

  it('should preserve tokens in the given string', function () {
    var html = tokens(re, '<ul><li><%= name %></li></ul>', fn);
    html.should.equal('<ul>\n  <li><%= name %></li>\n</ul>');
  });
});
