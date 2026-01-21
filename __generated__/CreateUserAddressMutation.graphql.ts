/**
 * @generated SignedSource<<959da8444dae43ae47a20d81c915f6b4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateUserAddressMutation$variables = {
  building?: string | null | undefined;
  delivery_address: string;
  details?: string | null | undefined;
  floor?: string | null | undefined;
  is_selected?: boolean | null | undefined;
  label: string;
  landmark?: string | null | undefined;
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
  user_id: string;
};
export type CreateUserAddressMutation$data = {
  readonly insertIntouser_addressesCollection: {
    readonly records: ReadonlyArray<{
      readonly building: string | null | undefined;
      readonly delivery_address: string | null | undefined;
      readonly details: string | null | undefined;
      readonly floor: string | null | undefined;
      readonly id: string;
      readonly is_selected: boolean | null | undefined;
      readonly label: string | null | undefined;
      readonly landmark: string | null | undefined;
      readonly latitude: string | null | undefined;
      readonly longitude: string | null | undefined;
      readonly user_id: string | null | undefined;
    }>;
  } | null | undefined;
};
export type CreateUserAddressMutation = {
  response: CreateUserAddressMutation$data;
  variables: CreateUserAddressMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "building"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "delivery_address"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "details"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "floor"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "is_selected"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "label"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "landmark"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "latitude"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "longitude"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "user_id"
},
v10 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "building",
        "variableName": "building"
      },
      {
        "kind": "Variable",
        "name": "delivery_address",
        "variableName": "delivery_address"
      },
      {
        "kind": "Variable",
        "name": "details",
        "variableName": "details"
      },
      {
        "kind": "Variable",
        "name": "floor",
        "variableName": "floor"
      },
      {
        "kind": "Variable",
        "name": "is_selected",
        "variableName": "is_selected"
      },
      {
        "kind": "Variable",
        "name": "label",
        "variableName": "label"
      },
      {
        "kind": "Variable",
        "name": "landmark",
        "variableName": "landmark"
      },
      {
        "kind": "Variable",
        "name": "latitude",
        "variableName": "latitude"
      },
      {
        "kind": "Variable",
        "name": "longitude",
        "variableName": "longitude"
      },
      {
        "kind": "Variable",
        "name": "user_id",
        "variableName": "user_id"
      }
    ],
    "kind": "ObjectValue",
    "name": "objects"
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "user_id",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "delivery_address",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "details",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "building",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "floor",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "landmark",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "latitude",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitude",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_selected",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateUserAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v10/*: any*/),
        "concreteType": "user_addressesInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntouser_addressesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "user_addresses",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v9/*: any*/),
      (v5/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateUserAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v10/*: any*/),
        "concreteType": "user_addressesInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntouser_addressesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "user_addresses",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "50089c9fbf1c16384ba6d44c1076f48d",
    "id": null,
    "metadata": {},
    "name": "CreateUserAddressMutation",
    "operationKind": "mutation",
    "text": "mutation CreateUserAddressMutation(\n  $user_id: UUID!\n  $label: String!\n  $delivery_address: String!\n  $details: String\n  $building: String\n  $floor: String\n  $landmark: String\n  $latitude: BigFloat\n  $longitude: BigFloat\n  $is_selected: Boolean\n) {\n  insertIntouser_addressesCollection(objects: {user_id: $user_id, label: $label, delivery_address: $delivery_address, details: $details, building: $building, floor: $floor, landmark: $landmark, latitude: $latitude, longitude: $longitude, is_selected: $is_selected}) {\n    records {\n      id\n      user_id\n      label\n      delivery_address\n      details\n      building\n      floor\n      landmark\n      latitude\n      longitude\n      is_selected\n      nodeId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8a1550336b04ee82ebb4c796b3d2e0ce";

export default node;
