import gql from 'graphql-tag';

export const GET_CART_QUERY = gql`
  query GET_CART_QUERY($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      cost {
        checkoutChargeAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        subtotalAmountEstimated
        totalAmount {
          amount
          currencyCode
        }
        totalAmountEstimated
      }
      createdAt
    }
  }
`;

export const CREATE_CART_MUTATION = gql`
  mutation CREATE_CART_MUTATION($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 5) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_QUERY = gql`
  query GET_PRODUCT_QUERY($id: ID!) {
    product(id: $id) {
      id
      variants(first: 1) {
        edges {
          node {
            id
            price {
                amount
            }
            availableForSale
            quantityAvailable
          }
        }
      }
    }
  }
`;
