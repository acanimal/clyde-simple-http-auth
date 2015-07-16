# Simple HTTP Authentication Filter

HTTP authentication filter for [Clyde](https://github.com/acanimal/clyde) API gateway, which allows to authenticate users both using basic and digest strategies.

> Implementation is based on on [passport-http](https://github.com/jaredhanson/passport-http) module.

<!-- MarkdownTOC -->

- [Configuration](#configuration)
  - [Examples](#examples)
    - [Configured as global prefilter](#configured-as-global-prefilter)
    - [Configured as provider prefilter](#configured-as-provider-prefilter)
  - [Notes](#notes)
- [License](#license)

<!-- /MarkdownTOC -->

## Configuration

Filter accepts the configuration properties:

* `realm`: A string that identifies the authentication realm.
* `method`: Indicates the authenticated method to be used. It is a required property. Allowed values are `basic` and `digest`.
* `consumers`: An object with the list of `user` properties and `password` values.


## Examples

### Configured as global prefilter

All requests are authenticated using basic auth:

```javascript
{
  "prefilters" : [
    {
      "id" : "basic-auth",
      "path" : "clyde-simple-http-auth",
      "config" : {
        "realm" : "clyde",
        "method" : "basic",
        "consumers" : {
          "userA" : "passwordA",
          ...
        }
      }
    }
    ...
  ]
}
```

### Configured as provider prefilter

Only the requests addresses to the provider are authenticated with digest method:

```javascript
{
  "providers" : [
    {
      "id" : "some_provider",
      "context" : "/some_provider",
      "target" : "http://some_server",
      "prefilters" : [
        {
          "id" : "digest-auth",
          "path" : "clyde-simple-http-auth",
          "config" : {
            "realm" : "clyde",
            "method" : "digest",
            "consumers" : {
              "userA" : "passwordA",
              ...
            }
          }
        }
    },
    ...
  ]
}
```

## Notes

* It has no sense configure an authentication filter as a global or provider's postfilter.


# License

The MIT License (MIT)

Copyright (c) 2015 Antonio Santiago (@acanimal)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
