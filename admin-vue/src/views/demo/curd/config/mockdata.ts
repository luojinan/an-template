export const mockTableData = {
  total: 2,
  records: [
    {
      id: 1,
      a: '1',
      status: 1,
    },
  ],
}

export const sleepFn = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
