import { json } from 'co-body'

/* interface IData {
  email: string
}
 */
export async function omsHook(ctx: Context, next: () => Promise<any>) {
  try {
    const { OrderId } = await json(ctx.req)
    
    console.log(OrderId)

    const {clientProfileData: { document: userId, email: email }} = await ctx.clients.oms.order(OrderId)
    
    console.log(userId)
    console.log(email.split("-",1))    

    ctx.body = 'OK'
    ctx.status = 200

/*     const data:IData[] = await ctx.clients.masterdata.searchDocuments({
      dataEntity: 'CL',
      where: `document=${userId}`,
      fields: ['email'],
      pagination: {
        pageSize: 1,
        page: 1
      }
    })
 */
/*     if (data.length !== 0) {
      const [{email}] = data
      
      await ctx.clients.leads.convertLead(email)
      ctx.body = 'OK'
      ctx.status = 200
      ctx.set('Cache-Control', 'no-cache no-store')
    } else {
      ctx.body = 'Not Found in Master Data'
      ctx.status = 404
    }
 */
    await next()
  } catch (error) {
 /*    ctx.body = JSON.stringify({message: error?.response?.data?.message || 'Erro ao converter lead'})
 */    // ctx.status = error?.response?.status || 500
    console.log(error)

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache no-store')
    await next()
  }
}