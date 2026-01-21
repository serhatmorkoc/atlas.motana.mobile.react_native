/**
 * @generated SignedSource<<5b200162fa9e1cbd15bde8c50bc1318a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StoreDeliverySettingsQuery$variables = {
  storeId: string;
};
export type StoreDeliverySettingsQuery$data = {
  readonly store_delivery_settingsCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly earning_base_fee: string;
        readonly earning_minimum: string;
        readonly earning_per_km: string;
        readonly google_maps_api_key: string | null | undefined;
        readonly id: string;
        readonly max_couriers_queue: number;
        readonly request_timeout_seconds: number;
        readonly search_radius_km: number;
        readonly store_id: string;
        readonly surge_active: boolean;
        readonly surge_multiplier: string;
        readonly use_google_maps: boolean;
      };
    }>;
  } | null | undefined;
};
export type StoreDeliverySettingsQuery = {
  response: StoreDeliverySettingsQuery$data;
  variables: StoreDeliverySettingsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "storeId"
  }
],
v1 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "eq",
            "variableName": "storeId"
          }
        ],
        "kind": "ObjectValue",
        "name": "store_id"
      }
    ],
    "kind": "ObjectValue",
    "name": "filter"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "store_id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "earning_base_fee",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "earning_per_km",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "earning_minimum",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "search_radius_km",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "max_couriers_queue",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "request_timeout_seconds",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "use_google_maps",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "google_maps_api_key",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "surge_active",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "surge_multiplier",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "StoreDeliverySettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "store_delivery_settingsConnection",
        "kind": "LinkedField",
        "name": "store_delivery_settingsCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "store_delivery_settingsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "store_delivery_settings",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "StoreDeliverySettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "store_delivery_settingsConnection",
        "kind": "LinkedField",
        "name": "store_delivery_settingsCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "store_delivery_settingsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "store_delivery_settings",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "nodeId",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ce805ec10ed50ef3491be7f5e696857a",
    "id": null,
    "metadata": {},
    "name": "StoreDeliverySettingsQuery",
    "operationKind": "query",
    "text": "query StoreDeliverySettingsQuery(\n  $storeId: UUID!\n) {\n  store_delivery_settingsCollection(filter: {store_id: {eq: $storeId}}, first: 1) {\n    edges {\n      node {\n        id\n        store_id\n        earning_base_fee\n        earning_per_km\n        earning_minimum\n        search_radius_km\n        max_couriers_queue\n        request_timeout_seconds\n        use_google_maps\n        google_maps_api_key\n        surge_active\n        surge_multiplier\n        nodeId\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "541a6806373c6b1fb894dc0c16992698";

export default node;
