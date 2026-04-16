export function isToday(ts) {
  const d = new Date(ts);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}


// [
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 14533,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 3,
//         "avgDuration": 20,
//         "maxDuration": 22
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 21
//         },
//         {
//           "name": "ADD_TO_CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/addtocart",
//           "method": "GET",
//           "status": 404,
//           "success": false,
//           "duration": 22,
//           "error": "Request failed with status code 404"
//         },
//         {
//           "name": "ADD_TO_CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/addtocart",
//           "method": "GET",
//           "status": 404,
//           "success": false,
//           "duration": 17,
//           "error": "Request failed with status code 404"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776175658399
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "ProductDetail",
//       "duration": 3123,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 57,
//         "maxDuration": 57
//       },
//       "apis": [
//         {
//           "name": "VIEW_PRODUCT",
//           "type": "interactive",
//           "url": "http://localhost:5000/viewproducts",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 57
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776175661524
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 12856,
//       "clicks": 4,
//       "uniqueClicks": [
//         "Category:wearables",
//         "Category:kitchen",
//         "Category:gaming",
//         "Category:all"
//       ],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 40,
//         "maxDuration": 40
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 40
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776175674382
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Cart",
//       "duration": 35757,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 1295,
//         "maxDuration": 1295
//       },
//       "apis": [
//         {
//           "name": "CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/cart",
//           "method": "GET",
//           "status": 0,
//           "success": false,
//           "duration": 1295,
//           "error": "Network Error"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776175710141
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 3189,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 16,
//         "maxDuration": 16
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 16
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776175763592
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Orders",
//       "duration": 3533,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 77,
//         "maxDuration": 77
//       },
//       "apis": [
//         {
//           "name": "ORDERS",
//           "type": "interactive",
//           "url": "http://localhost:5000/orders",
//           "method": "GET",
//           "status": 400,
//           "success": false,
//           "duration": 77,
//           "error": "Request failed with status code 400"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776175767127
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 8768,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 46,
//         "maxDuration": 46
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 46
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776175775896
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 39948,
//       "clicks": 4,
//       "uniqueClicks": [
//         "Category:accessories",
//         "Category:wearables",
//         "Category:kitchen",
//         "Category:all"
//       ],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 2,
//         "avgDuration": 25,
//         "maxDuration": 28
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 28
//         },
//         {
//           "name": "ADD_TO_CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/addtocart",
//           "method": "GET",
//           "status": 404,
//           "success": false,
//           "duration": 21,
//           "error": "Request failed with status code 404"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776183694288
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "ProductDetail",
//       "duration": 3745,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 36,
//         "maxDuration": 36
//       },
//       "apis": [
//         {
//           "name": "VIEW_PRODUCT",
//           "type": "interactive",
//           "url": "http://localhost:5000/viewproducts",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 36
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776183698035
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 50683,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 46,
//         "maxDuration": 46
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 46
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776183748719
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Cart",
//       "duration": 3747,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 1134,
//         "maxDuration": 1134
//       },
//       "apis": [
//         {
//           "name": "CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/cart",
//           "method": "GET",
//           "status": 0,
//           "success": false,
//           "duration": 1134,
//           "error": "Network Error"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776183752467
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 1485,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 55,
//         "maxDuration": 55
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 55
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776183753953
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Checkout",
//       "duration": 949,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 628,
//         "maxDuration": 628
//       },
//       "apis": [
//         {
//           "name": "CHECKOUT",
//           "type": "interactive",
//           "url": "http://localhost:5000/checkouts",
//           "method": "GET",
//           "status": 500,
//           "success": false,
//           "duration": 628,
//           "error": "Request failed with status code 500"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776183754904
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 1606,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 19,
//         "maxDuration": 19
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 19
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776183756511
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Orders",
//       "duration": 779,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 38,
//         "maxDuration": 38
//       },
//       "apis": [
//         {
//           "name": "ORDERS",
//           "type": "interactive",
//           "url": "http://localhost:5000/orders",
//           "method": "GET",
//           "status": 400,
//           "success": false,
//           "duration": 38,
//           "error": "Request failed with status code 400"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776183757292
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 4172,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 15,
//         "maxDuration": 15
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 15
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776183761465
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Checkout",
//       "duration": 3138,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 16,
//         "maxDuration": 16
//       },
//       "apis": [
//         {
//           "name": "CHECKOUT",
//           "type": "interactive",
//           "url": "http://localhost:5000/checkouts",
//           "method": "GET",
//           "status": 500,
//           "success": false,
//           "duration": 16,
//           "error": "Request failed with status code 500"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776184320084
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 849,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 32,
//         "maxDuration": 32
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 32
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776184320934
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Orders",
//       "duration": 604,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 24,
//         "maxDuration": 24
//       },
//       "apis": [
//         {
//           "name": "ORDERS",
//           "type": "interactive",
//           "url": "http://localhost:5000/orders",
//           "method": "GET",
//           "status": 400,
//           "success": false,
//           "duration": 24,
//           "error": "Request failed with status code 400"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776184321540
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 1770,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 897,
//         "maxDuration": 897
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 897
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776184323311
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Checkout",
//       "duration": 648,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 23,
//         "maxDuration": 23
//       },
//       "apis": [
//         {
//           "name": "CHECKOUT",
//           "type": "interactive",
//           "url": "http://localhost:5000/checkouts",
//           "method": "GET",
//           "status": 500,
//           "success": false,
//           "duration": 23,
//           "error": "Request failed with status code 500"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776184323960
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 4957,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 2,
//         "avgDuration": 189,
//         "maxDuration": 341
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 341
//         },
//         {
//           "name": "ADD_TO_CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/addtocart",
//           "method": "GET",
//           "status": 404,
//           "success": false,
//           "duration": 36,
//           "error": "Request failed with status code 404"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776184328919
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 5765,
//       "clicks": 1,
//       "uniqueClicks": [
//         "Category:footwear"
//       ],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 13,
//         "maxDuration": 13
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 13
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776235984072
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Cart",
//       "duration": 25265,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 20014,
//         "maxDuration": 20014
//       },
//       "apis": [
//         {
//           "name": "CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/cart",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 20014
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776236737072
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 19434,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 31,
//         "maxDuration": 31
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 31
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "prudhvi123",
//     "ts": 1776237859087
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 24267,
//       "clicks": 4,
//       "uniqueClicks": [
//         "Category:accessories",
//         "Category:kitchen",
//         "Category:fitness",
//         "Category:all"
//       ],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 2,
//         "avgDuration": 59,
//         "maxDuration": 84
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 33
//         },
//         {
//           "name": "ADD_TO_CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/addtocart",
//           "method": "GET",
//           "status": 404,
//           "success": false,
//           "duration": 84,
//           "error": "Request failed with status code 404"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "karnakar123",
//     "ts": 1776246555103
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Cart",
//       "duration": 28010,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 20073,
//         "maxDuration": 20073
//       },
//       "apis": [
//         {
//           "name": "CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/cart",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 20073
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "karnakar123",
//     "ts": 1776246592677
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 20741,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 74,
//         "maxDuration": 74
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 74
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "karnakar123",
//     "ts": 1776246613418
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Orders",
//       "duration": 13206,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 28,
//         "maxDuration": 28
//       },
//       "apis": [
//         {
//           "name": "ORDERS",
//           "type": "interactive",
//           "url": "http://localhost:5000/orders",
//           "method": "GET",
//           "status": 400,
//           "success": false,
//           "duration": 28,
//           "error": "Request failed with status code 400"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "karnakar123",
//     "ts": 1776246635086
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 17062,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 3,
//         "avgDuration": 12,
//         "maxDuration": 14
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 11
//         },
//         {
//           "name": "ADD_TO_CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/addtocart",
//           "method": "GET",
//           "status": 404,
//           "success": false,
//           "duration": 12,
//           "error": "Request failed with status code 404"
//         },
//         {
//           "name": "ADD_TO_CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/addtocart",
//           "method": "GET",
//           "status": 404,
//           "success": false,
//           "duration": 14,
//           "error": "Request failed with status code 404"
//         }
//       ],
//       "errors": 0
//     },
//     "sessionId": "d65073e2-5fc6-4343-85f8-b960bce1920a",
//     "user": "uday123",
//     "ts": 1776249603009
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 23215,
//       "clicks": 10,
//       "uniqueClicks": [
//         "Category:kitchen",
//         "Category:wearables",
//         "Category:accessories",
//         "Category:footwear",
//         "Category:clothing",
//         "Category:mobiles",
//         "Category:gaming",
//         "Category:fitness",
//         "Category:all"
//       ],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 2,
//         "avgDuration": 29,
//         "maxDuration": 42
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 42
//         },
//         {
//           "name": "ADD_TO_CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/addtocart",
//           "method": "GET",
//           "status": 404,
//           "success": false,
//           "duration": 15,
//           "error": "Request failed with status code 404"
//         }
//       ],
//       "errors": 0,
//       "performance": {
//         "dns": 0,
//         "tcp": 0,
//         "ttfb": 263,
//         "domLoad": 461,
//         "pageLoad": 462
//       }
//     },
//     "sessionId": "1ca203b6-89b5-47b6-babe-12b838160991",
//     "user": "prudhvi123",
//     "ts": 1776271062029
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Orders",
//       "duration": 26019,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 137,
//         "maxDuration": 137
//       },
//       "apis": [
//         {
//           "name": "ORDERS",
//           "type": "interactive",
//           "url": "http://localhost:5000/orders",
//           "method": "GET",
//           "status": 400,
//           "success": false,
//           "duration": 137,
//           "error": "Request failed with status code 400"
//         }
//       ],
//       "errors": 0,
//       "performance": {
//         "dns": 0,
//         "tcp": 0,
//         "ttfb": 263,
//         "domLoad": 461,
//         "pageLoad": 462
//       }
//     },
//     "sessionId": "1ca203b6-89b5-47b6-babe-12b838160991",
//     "user": "prudhvi123",
//     "ts": 1776271088050
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Orders",
//       "duration": 4947028,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 62,
//         "maxDuration": 62
//       },
//       "apis": [
//         {
//           "name": "ORDERS",
//           "type": "interactive",
//           "url": "http://localhost:5000/orders",
//           "method": "GET",
//           "status": 400,
//           "success": false,
//           "duration": 62,
//           "error": "Request failed with status code 400"
//         }
//       ],
//       "errors": 0,
//       "performance": {
//         "dns": 0,
//         "tcp": 0,
//         "ttfb": 263,
//         "domLoad": 461,
//         "pageLoad": 462
//       }
//     },
//     "sessionId": "1ca203b6-89b5-47b6-babe-12b838160991",
//     "user": "",
//     "ts": 1776355400350
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Orders",
//       "duration": 39266,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 42,
//         "maxDuration": 42
//       },
//       "apis": [
//         {
//           "name": "ORDERS",
//           "type": "interactive",
//           "url": "http://localhost:5000/orders",
//           "method": "GET",
//           "status": 400,
//           "success": false,
//           "duration": 42,
//           "error": "Request failed with status code 400"
//         }
//       ],
//       "errors": 0,
//       "performance": {
//         "dns": 0,
//         "tcp": 0,
//         "ttfb": 263,
//         "domLoad": 461,
//         "pageLoad": 462
//       }
//     },
//     "sessionId": "1ca203b6-89b5-47b6-babe-12b838160991",
//     "user": "",
//     "ts": 1776355439617
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 29454,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 2,
//         "avgDuration": 54,
//         "maxDuration": 74
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 74
//         },
//         {
//           "name": "ADD_TO_CART",
//           "type": "interactive",
//           "url": "http://localhost:5000/addtocart",
//           "method": "GET",
//           "status": 404,
//           "success": false,
//           "duration": 33,
//           "error": "Request failed with status code 404"
//         }
//       ],
//       "errors": 0,
//       "performance": {
//         "dns": 0,
//         "tcp": 0,
//         "ttfb": 263,
//         "domLoad": 461,
//         "pageLoad": 462
//       }
//     },
//     "sessionId": "1ca203b6-89b5-47b6-babe-12b838160991",
//     "user": "",
//     "ts": 1776355469073
//   },
//   {
//     "eventName": "PAGE_SUMMARY",
//     "data": {
//       "page": "Dashboard",
//       "duration": 10960,
//       "clicks": 0,
//       "uniqueClicks": [],
//       "searches": {
//         "count": 0,
//         "queries": []
//       },
//       "filters": {},
//       "api": {
//         "count": 1,
//         "avgDuration": 29,
//         "maxDuration": 29
//       },
//       "apis": [
//         {
//           "name": "GET_PRODUCTS",
//           "type": "initial",
//           "url": "http://localhost:5000/products",
//           "method": "GET",
//           "status": 200,
//           "success": true,
//           "duration": 29
//         }
//       ],
//       "errors": 0,
//       "performance": {
//         "dns": 0,
//         "tcp": 0,
//         "ttfb": 6,
//         "domLoad": 418,
//         "pageLoad": 430
//       }
//     },
//     "sessionId": "1ca203b6-89b5-47b6-babe-12b838160991",
//     "user": "prudhvi123",
//     "ts": 1776355522391
//   }
// ]