import { graphql } from '@graphql/__generated'

export const UPDATE_ORGANISATION = graphql(`
  mutation updateOrganisation(
    $name: String!
    $organisationType: String
    $mainColour: String
    $bannerImage: String
    $logoImage: String
    $currency: String
    $percentage: Float
    $headerTextOne: String
    $headerTextTwo: String
    $dashboardPopupDoNotShowAgain: Boolean
  ) {
    updateOrganisation(
      name: $name
      organisationType: $organisationType
      mainColour: $mainColour
      bannerImage: $bannerImage
      logoImage: $logoImage
      currency: $currency
      percentage: $percentage
      headerTextOne: $headerTextOne
      headerTextTwo: $headerTextTwo
      dashboardPopupDoNotShowAgain: $dashboardPopupDoNotShowAgain
    ) {
      success
    }
  }
`)
