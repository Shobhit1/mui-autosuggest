const path = require('path')

module.exports = {
    "parser": "babel-eslint",
    "extends": "eslint-config-airbnb-easy",
    "env": {
        "browser": true,
        "node": true,
        "mocha": true,
    },
    "plugins": [
        "react"
    ],
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".c.js", ".g.js"],
                "paths": ["node_modules", path.join(__dirname, "src")]
            },
        }
    },
  "globals": {
    "tinymce": true,
    "beforeAll": true,
    "afterAll": true,
    "context": true,
  }
}
