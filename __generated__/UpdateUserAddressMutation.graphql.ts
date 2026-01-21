/**
 * @generated SignedSource<<eb0721ce1272bc6945bd26b09387a455>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateUserAddressMutation$variables = {
  building?: string | null | undefined;
  delivery_address?: string | null | undefined;
  details?: string | null | undefined;
  floor?: string | null | undefined;
  id: string;
  label?: string | null | undefined;
  landmark?: string | null | undefined;
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
};
export type UpdateUserAddressMutation$data = {
  readonly updateuser_addressesCollection: {
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
  };
};
export type UpdateUserAddressMutation = {
  response: UpdateUserAddressMutation$data;
  variables: UpdateUserAddressMutation$variables;
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
  "name": "id"
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
v9 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "eq",
            "variableName": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "id"
      }
    ],
    "kind": "ObjectValue",
    "name": "filter"
  },
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
      }
    ],
    "kind": "ObjectValue",
    "name": "set"
  }
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "user_id",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "delivery_address",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "details",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "building",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "floor",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "landmark",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "latitude",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitude",
  "storageKey": null
},
v20 = {
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
      (v8/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateUserAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": "user_addressesUpdateResponse",
        "kind": "LinkedField",
        "name": "updateuser_addressesCollection",
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
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/)
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
      (v4/*: any*/),
      (v5/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Operation",
    "name": "UpdateUserAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": "user_addressesUpdateResponse",
        "kind": "LinkedField",
        "name": "updateuser_addressesCollection",
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
              (v10/*: any*/),
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
    "cacheID": "a0e8f00a2b34f9380c35656cef9e5744",
    "id": null,
    "metadata": {},
    "name": "UpdateUserAddressMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateUserAddressMutation(\n  $id: UUID!\n  $label: String\n  $delivery_address: String\n  $details: String\n  $building: String\n  $floor: String\n  $landmark: String\n  $latitude: BigFloat\n  $longitude: BigFloat\n) {\n  updateuser_addressesCollection(set: {label: $label, delivery_address: $delivery_address, details: $details, building: $building, floor: $floor, landmark: $landmark, latitude: $latitude, longitude: $longitude}, filter: {id: {eq: $id}}) {\n    records {\n      id\n      user_id\n      label\n      delivery_address\n      details\n      building\n      floor\n      landmark\n      latitude\n      longitude\n      is_selected\n      nodeId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d110c644a14db07140e2f84d88023005";

export default node;
