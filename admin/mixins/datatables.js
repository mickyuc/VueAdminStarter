export default {
  data: () => ({
    datatables: {
      options: {
        page: 1,
        itemsPerPage: 50,
        mustSort: false,
        multiSort: true
      },
      footerProps: {
        'items-per-page-options': [25, 50, 100]
      }
    }
  })
}
