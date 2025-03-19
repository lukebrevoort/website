/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/notion-webhook/route";
exports.ids = ["app/api/notion-webhook/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnotion-webhook%2Froute&page=%2Fapi%2Fnotion-webhook%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnotion-webhook%2Froute.ts&appDir=%2FUsers%2Flbrevoort%2FDesktop%2Fprojects%2Fpersonal-website%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flbrevoort%2FDesktop%2Fprojects%2Fpersonal-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnotion-webhook%2Froute&page=%2Fapi%2Fnotion-webhook%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnotion-webhook%2Froute.ts&appDir=%2FUsers%2Flbrevoort%2FDesktop%2Fprojects%2Fpersonal-website%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flbrevoort%2FDesktop%2Fprojects%2Fpersonal-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_lbrevoort_Desktop_projects_personal_website_src_app_api_notion_webhook_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/notion-webhook/route.ts */ \"(rsc)/./src/app/api/notion-webhook/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/notion-webhook/route\",\n        pathname: \"/api/notion-webhook\",\n        filename: \"route\",\n        bundlePath: \"app/api/notion-webhook/route\"\n    },\n    resolvedPagePath: \"/Users/lbrevoort/Desktop/projects/personal-website/src/app/api/notion-webhook/route.ts\",\n    nextConfigOutput,\n    userland: _Users_lbrevoort_Desktop_projects_personal_website_src_app_api_notion_webhook_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZub3Rpb24td2ViaG9vayUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbm90aW9uLXdlYmhvb2slMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZub3Rpb24td2ViaG9vayUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmxicmV2b29ydCUyRkRlc2t0b3AlMkZwcm9qZWN0cyUyRnBlcnNvbmFsLXdlYnNpdGUlMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGbGJyZXZvb3J0JTJGRGVza3RvcCUyRnByb2plY3RzJTJGcGVyc29uYWwtd2Vic2l0ZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD1zdGFuZGFsb25lJnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3NDO0FBQ25IO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvbGJyZXZvb3J0L0Rlc2t0b3AvcHJvamVjdHMvcGVyc29uYWwtd2Vic2l0ZS9zcmMvYXBwL2FwaS9ub3Rpb24td2ViaG9vay9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJzdGFuZGFsb25lXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL25vdGlvbi13ZWJob29rL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvbm90aW9uLXdlYmhvb2tcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL25vdGlvbi13ZWJob29rL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2xicmV2b29ydC9EZXNrdG9wL3Byb2plY3RzL3BlcnNvbmFsLXdlYnNpdGUvc3JjL2FwcC9hcGkvbm90aW9uLXdlYmhvb2svcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnotion-webhook%2Froute&page=%2Fapi%2Fnotion-webhook%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnotion-webhook%2Froute.ts&appDir=%2FUsers%2Flbrevoort%2FDesktop%2Fprojects%2Fpersonal-website%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flbrevoort%2FDesktop%2Fprojects%2Fpersonal-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/notion-webhook/route.ts":
/*!*********************************************!*\
  !*** ./src/app/api/notion-webhook/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/cache */ \"(rsc)/./node_modules/next/cache.js\");\n/* harmony import */ var next_cache__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_cache__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nasync function POST(request) {\n    try {\n        // Get the raw request body for signature verification\n        const requestClone = request.clone();\n        const rawBody = await requestClone.text();\n        // Verify this is a valid request from Notion\n        const notionSecret = request.headers.get('Notion-Signature');\n        const notionTimestamp = request.headers.get('Notion-Timestamp');\n        if (!notionSecret || !notionTimestamp) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                message: 'Unauthorized'\n            }, {\n                status: 401\n            });\n        }\n        // Verify signature\n        const signingSecret = process.env.NOTION_WEBHOOK_SECRET;\n        if (signingSecret) {\n            const hmac = crypto__WEBPACK_IMPORTED_MODULE_2__.createHmac('sha256', signingSecret);\n            const signature = hmac.update(`${notionTimestamp}:${rawBody}`).digest('hex');\n            if (signature !== notionSecret) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    success: false,\n                    message: 'Invalid signature'\n                }, {\n                    status: 401\n                });\n            }\n        }\n        // Parse the body\n        const body = JSON.parse(rawBody);\n        // Handle the webhook payload\n        if (body.type === 'page.update' || body.type === 'page.create') {\n            // Revalidate the blog pages\n            (0,next_cache__WEBPACK_IMPORTED_MODULE_1__.revalidatePath)('/blog');\n            (0,next_cache__WEBPACK_IMPORTED_MODULE_1__.revalidatePath)(`/blog/${body.payload.page.id}`);\n            console.log(`Revalidated blog and post ${body.payload.page.id}`);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: true,\n                revalidated: true\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            message: 'No action required'\n        });\n    } catch (error) {\n        console.error('Error processing Notion webhook:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            message: 'Internal Server Error'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9ub3Rpb24td2ViaG9vay9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBMkM7QUFDQztBQUNYO0FBRTFCLGVBQWVHLEtBQUtDLE9BQWdCO0lBQ3pDLElBQUk7UUFDRixzREFBc0Q7UUFDdEQsTUFBTUMsZUFBZUQsUUFBUUUsS0FBSztRQUNsQyxNQUFNQyxVQUFVLE1BQU1GLGFBQWFHLElBQUk7UUFFdkMsNkNBQTZDO1FBQzdDLE1BQU1DLGVBQWVMLFFBQVFNLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDO1FBQ3pDLE1BQU1DLGtCQUFrQlIsUUFBUU0sT0FBTyxDQUFDQyxHQUFHLENBQUM7UUFFNUMsSUFBSSxDQUFDRixnQkFBZ0IsQ0FBQ0csaUJBQWlCO1lBQ3JDLE9BQU9aLHFEQUFZQSxDQUFDYSxJQUFJLENBQUM7Z0JBQUVDLFNBQVM7Z0JBQU9DLFNBQVM7WUFBZSxHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDdEY7UUFFQSxtQkFBbUI7UUFDbkIsTUFBTUMsZ0JBQWdCQyxRQUFRQyxHQUFHLENBQUNDLHFCQUFxQjtRQUN2RCxJQUFJSCxlQUFlO1lBQ2pCLE1BQU1JLE9BQU9uQiw4Q0FBaUIsQ0FBQyxVQUFVZTtZQUN6QyxNQUFNTSxZQUFZRixLQUNmRyxNQUFNLENBQUMsR0FBR1osZ0JBQWdCLENBQUMsRUFBRUwsU0FBUyxFQUN0Q2tCLE1BQU0sQ0FBQztZQUVWLElBQUlGLGNBQWNkLGNBQWM7Z0JBQzlCLE9BQU9ULHFEQUFZQSxDQUFDYSxJQUFJLENBQUM7b0JBQUVDLFNBQVM7b0JBQU9DLFNBQVM7Z0JBQW9CLEdBQUc7b0JBQUVDLFFBQVE7Z0JBQUk7WUFDM0Y7UUFDRjtRQUVBLGlCQUFpQjtRQUNqQixNQUFNVSxPQUFPQyxLQUFLQyxLQUFLLENBQUNyQjtRQUV4Qiw2QkFBNkI7UUFDN0IsSUFBSW1CLEtBQUtHLElBQUksS0FBSyxpQkFBaUJILEtBQUtHLElBQUksS0FBSyxlQUFlO1lBQzlELDRCQUE0QjtZQUM1QjVCLDBEQUFjQSxDQUFDO1lBQ2ZBLDBEQUFjQSxDQUFDLENBQUMsTUFBTSxFQUFFeUIsS0FBS0ksT0FBTyxDQUFDQyxJQUFJLENBQUNDLEVBQUUsRUFBRTtZQUU5Q0MsUUFBUUMsR0FBRyxDQUFDLENBQUMsMEJBQTBCLEVBQUVSLEtBQUtJLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDQyxFQUFFLEVBQUU7WUFDL0QsT0FBT2hDLHFEQUFZQSxDQUFDYSxJQUFJLENBQUM7Z0JBQUVDLFNBQVM7Z0JBQU1xQixhQUFhO1lBQUs7UUFDOUQ7UUFFQSxPQUFPbkMscURBQVlBLENBQUNhLElBQUksQ0FBQztZQUFFQyxTQUFTO1lBQU1DLFNBQVM7UUFBcUI7SUFDMUUsRUFBRSxPQUFPcUIsT0FBTztRQUNkSCxRQUFRRyxLQUFLLENBQUMsb0NBQW9DQTtRQUNsRCxPQUFPcEMscURBQVlBLENBQUNhLElBQUksQ0FBQztZQUFFQyxTQUFTO1lBQU9DLFNBQVM7UUFBd0IsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDL0Y7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2xicmV2b29ydC9EZXNrdG9wL3Byb2plY3RzL3BlcnNvbmFsLXdlYnNpdGUvc3JjL2FwcC9hcGkvbm90aW9uLXdlYmhvb2svcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgLy8gR2V0IHRoZSByYXcgcmVxdWVzdCBib2R5IGZvciBzaWduYXR1cmUgdmVyaWZpY2F0aW9uXG4gICAgY29uc3QgcmVxdWVzdENsb25lID0gcmVxdWVzdC5jbG9uZSgpO1xuICAgIGNvbnN0IHJhd0JvZHkgPSBhd2FpdCByZXF1ZXN0Q2xvbmUudGV4dCgpO1xuICAgIFxuICAgIC8vIFZlcmlmeSB0aGlzIGlzIGEgdmFsaWQgcmVxdWVzdCBmcm9tIE5vdGlvblxuICAgIGNvbnN0IG5vdGlvblNlY3JldCA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ05vdGlvbi1TaWduYXR1cmUnKTtcbiAgICBjb25zdCBub3Rpb25UaW1lc3RhbXAgPSByZXF1ZXN0LmhlYWRlcnMuZ2V0KCdOb3Rpb24tVGltZXN0YW1wJyk7XG5cbiAgICBpZiAoIW5vdGlvblNlY3JldCB8fCAhbm90aW9uVGltZXN0YW1wKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogJ1VuYXV0aG9yaXplZCcgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gVmVyaWZ5IHNpZ25hdHVyZVxuICAgIGNvbnN0IHNpZ25pbmdTZWNyZXQgPSBwcm9jZXNzLmVudi5OT1RJT05fV0VCSE9PS19TRUNSRVQ7XG4gICAgaWYgKHNpZ25pbmdTZWNyZXQpIHtcbiAgICAgIGNvbnN0IGhtYWMgPSBjcnlwdG8uY3JlYXRlSG1hYygnc2hhMjU2Jywgc2lnbmluZ1NlY3JldCk7XG4gICAgICBjb25zdCBzaWduYXR1cmUgPSBobWFjXG4gICAgICAgIC51cGRhdGUoYCR7bm90aW9uVGltZXN0YW1wfToke3Jhd0JvZHl9YClcbiAgICAgICAgLmRpZ2VzdCgnaGV4Jyk7XG5cbiAgICAgIGlmIChzaWduYXR1cmUgIT09IG5vdGlvblNlY3JldCkge1xuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogJ0ludmFsaWQgc2lnbmF0dXJlJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBQYXJzZSB0aGUgYm9keVxuICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKHJhd0JvZHkpO1xuICAgIFxuICAgIC8vIEhhbmRsZSB0aGUgd2ViaG9vayBwYXlsb2FkXG4gICAgaWYgKGJvZHkudHlwZSA9PT0gJ3BhZ2UudXBkYXRlJyB8fCBib2R5LnR5cGUgPT09ICdwYWdlLmNyZWF0ZScpIHtcbiAgICAgIC8vIFJldmFsaWRhdGUgdGhlIGJsb2cgcGFnZXNcbiAgICAgIHJldmFsaWRhdGVQYXRoKCcvYmxvZycpO1xuICAgICAgcmV2YWxpZGF0ZVBhdGgoYC9ibG9nLyR7Ym9keS5wYXlsb2FkLnBhZ2UuaWR9YCk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKGBSZXZhbGlkYXRlZCBibG9nIGFuZCBwb3N0ICR7Ym9keS5wYXlsb2FkLnBhZ2UuaWR9YCk7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiB0cnVlLCByZXZhbGlkYXRlZDogdHJ1ZSB9KTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ05vIGFjdGlvbiByZXF1aXJlZCcgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgcHJvY2Vzc2luZyBOb3Rpb24gd2ViaG9vazonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn0iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicmV2YWxpZGF0ZVBhdGgiLCJjcnlwdG8iLCJQT1NUIiwicmVxdWVzdCIsInJlcXVlc3RDbG9uZSIsImNsb25lIiwicmF3Qm9keSIsInRleHQiLCJub3Rpb25TZWNyZXQiLCJoZWFkZXJzIiwiZ2V0Iiwibm90aW9uVGltZXN0YW1wIiwianNvbiIsInN1Y2Nlc3MiLCJtZXNzYWdlIiwic3RhdHVzIiwic2lnbmluZ1NlY3JldCIsInByb2Nlc3MiLCJlbnYiLCJOT1RJT05fV0VCSE9PS19TRUNSRVQiLCJobWFjIiwiY3JlYXRlSG1hYyIsInNpZ25hdHVyZSIsInVwZGF0ZSIsImRpZ2VzdCIsImJvZHkiLCJKU09OIiwicGFyc2UiLCJ0eXBlIiwicGF5bG9hZCIsInBhZ2UiLCJpZCIsImNvbnNvbGUiLCJsb2ciLCJyZXZhbGlkYXRlZCIsImVycm9yIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/notion-webhook/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnotion-webhook%2Froute&page=%2Fapi%2Fnotion-webhook%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnotion-webhook%2Froute.ts&appDir=%2FUsers%2Flbrevoort%2FDesktop%2Fprojects%2Fpersonal-website%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flbrevoort%2FDesktop%2Fprojects%2Fpersonal-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();