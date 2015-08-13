"use strict";

var path = require("path"),
    supertest = require("supertest"),
    request = require("request"),
    expect = require("chai").expect,
    http = require("http"),
    clyde = require("clydeio");


describe("simple-http-auth", function() {

  var server;

  afterEach(function() {
    if (server) {
      server.close();
    }
  });


  it("should fail due invalid authentication method", function(done) {
    var logDirectory = path.join(__dirname, "../tmp");

    var options = {
      port: 8888,
      logfile: path.join(logDirectory, "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "simple-http-auth",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            realm: "test",
            method: "invalid-method",
            consumers: {
              "userA": "passwordA"
            }
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://server"
        }
      ]
    };

    // Create server with clyde's middleware options
    try {
      clyde.createMiddleware(options);
      throw new Error("Should not arrive here");
    } catch (err) {
      expect(err.message).to.contains("simple-http-auth");
      done();
    }
  });


  it("should fail due invalid basic authentication", function(done) {
    var logDirectory = path.join(__dirname, "../tmp");

    var options = {
      port: 8888,
      logfile: path.join(logDirectory, "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "simple-http-auth",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            realm: "test",
            method: "basic",
            consumers: {
              "userA": "passwordA"
            }
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://server"
        }
      ]
    };

    // Create server with clyde's middleware options
    var middleware = clyde.createMiddleware(options);
    server = http.createServer(middleware);
    server.listen(options.port);

    // Make request which expects a not authenticated error
    supertest("http://localhost:8888")
      .get("/foo")
      .auth("bad-user", "bad-password")
      .expect(401)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.headers["www-authenticate"]).to.contains("Basic realm=\"test\"");
        done();
      });
  });


  it("should success request with basic authentication", function(done) {
    var logDirectory = path.join(__dirname, "../tmp");

    var options = {
      port: 8888,
      logfile: path.join(logDirectory, "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "simple-http-auth",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            realm: "test",
            method: "basic",
            consumers: {
              "userA": "passwordA"
            }
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://server"
        }
      ]
    };

    // Create server with clyde's middleware options
    var middleware = clyde.createMiddleware(options);
    server = http.createServer(middleware);
    server.listen(options.port);

    // Make request which expects a not found error
    supertest("http://localhost:8888")
      .get("/foo")
      .auth("userA", "passwordA")
      .expect(404, done);
  });


  it("should fail due invalid digest authentication", function(done) {
    var logDirectory = path.join(__dirname, "../tmp");

    var options = {
      port: 8888,
      logfile: path.join(logDirectory, "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "simple-http-auth",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            realm: "test",
            method: "digest",
            consumers: {
              "userA": "passwordA"
            }
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://server"
        }
      ]
    };

    // Create server with clyde's middleware options
    var middleware = clyde.createMiddleware(options);
    server = http.createServer(middleware);
    server.listen(options.port);

    // Make request which expects a not authenticated error
    request.get("http://localhost:8888/foo", {
      "auth": {
        "user": "bad-username",
        "pass": "bad-password",
        "sendImmediately": false
      }
    }, function (err, res) {
      if (err) {
        throw err;
      }
      expect(res.statusCode).to.be.equal(401);
      expect(res.headers["www-authenticate"]).to.contains("Digest realm=\"test\"");
      done();
    });
  });


  it("should success request with digest authentication", function(done) {
    var logDirectory = path.join(__dirname, "../tmp");

    var options = {
      port: 8888,
      logfile: path.join(logDirectory, "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "simple-http-auth",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            realm: "test",
            method: "digest",
            consumers: {
              "userA": "passwordA"
            }
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://server"
        }
      ]
    };

    // Create server with clyde's middleware options
    var middleware = clyde.createMiddleware(options);
    server = http.createServer(middleware);
    server.listen(options.port);

    // Make request which expects a not found error
    request.get("http://localhost:8888/foo", {
      "auth": {
        "user": "userA",
        "pass": "passwordA",
        "sendImmediately": false
      }
    }, function (err, res) {
      if (err) {
        throw err;
      }
      expect(res.statusCode).to.be.equal(404);
      done();
    });
  });

});
