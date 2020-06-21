/*
    Product will have a storeId
    Store will have a ownerId which is userId when role is vendor.

    Creating Stores will be done by Admin
    Creating products can be done by admin and vendor.
    Updating product can be done by admin and vendor.
    Opening and Closing Store will be based on Vendor login.

    Todo Now
    Create a vendor id
    Create a store for him
    Create products for him
    Perform Total Crud.

    createProduct: {
        if(user.role === 'user') {
         return null.
        } else if (user.role === 'admin') {
            full Access. how?
            getAll stores.
            select store id.
            create product using store id
        } else {
         if user.role === 'store' {
            getStore({owner: user._id})
            got store id
            create Product
         }
        }
     }

     "products": [
      {
        "id": "5eee54665d72d337f80b4466",
        "name": "North Indian Meal",
        "description": "Fresh North Indian Veg Meal With Roti, Rice,Kichdi and Paapad",
        "price": 140,
        "discount": 10,
        "amountToPay": 126,
        "category": {
          "id": "5eeb5f9cd6b2af44fce2d784",
          "name": "food"
        },
        "productImage": "someImage",
        "store": {
          "id": "5ee7b1c83d3d2705f8286bba"
        },
        "createdAt": "1592677433734",
        "updatedAt": "1592677433734"
      }

    ]
  }
*/
