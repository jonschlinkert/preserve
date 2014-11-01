/*!
 * preserve <https://github.com/jonschlinkert/preserve>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var Tokens = require('./');
var tokens;

var re = /<%=\s*[^>]+%>/g;
var pretty = function(str) {
  return require('js-beautify').html(str, {
    indent_char: ' ',
    indent_size: 2,
  });
};

describe('preserve tokens', function () {
  before(function () {
    tokens = new Tokens(/<%=\s*[^>]+%>/g);
  });

  it('should (e.g. shouldn\'t, but will) mangle tokens in the given string', function () {
    var html = pretty('<ul><li><%= name %></li></ul>');
    html.should.equal('<ul>\n  <li>\n    <%=n ame %>\n  </li>\n</ul>');
  });

  it('should preserve tokens in the given string', function () {
    var html = tokens.after(pretty(tokens.before('<ul><li><%= name %></li></ul>')));
    html.should.equal('<ul>\n  <li><%= name %></li>\n</ul>');
  });
});

describe('API', function () {
  before(function () {
    tokens = new Tokens(/<%=\s*[^>]+%>/g);
  });
  describe('.before()', function () {
    it('should replace matches with placeholder tokens:', function () {
      tokens.before('<%= a %>\n<%= b %>\n<%= c %>').should.equal('__ID0__\n__ID1__\n__ID2__');
    });
  });

  describe('.after()', function () {
    it('should replace placeholder tokens with original values:', function () {
      tokens.before('<%= a %>\n<%= b %>\n<%= c %>').should.equal('__ID0__\n__ID1__\n__ID2__');
      tokens.after('__ID0__\n__ID1__\n__ID2__').should.equal('<%= a %>\n<%= b %>\n<%= c %>');
    });
  });
});
