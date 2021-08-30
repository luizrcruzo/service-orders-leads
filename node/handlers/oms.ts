import { json } from 'co-body'
import axios from 'axios';
/* interface IData {
  email: string
}
 */
export async function omsHook(ctx: Context, next: () => Promise<any>) {
  try {
    const { OrderId } = await json(ctx.req)

    console.log(OrderId)

    const { clientProfileData: { document: userId, email: email } } = await ctx.clients.oms.order(OrderId)

    console.log(userId)
    // console.log(email.split("-", 1))
    const userEmail = email.split("-", 1)[0];
    console.log(userEmail);
    console.log(typeof userEmail);

    //extract JSON from the http response // do something with myJson }`
    ctx.body = 'OK'
    ctx.status = 200

    let arr: any = [];
    await axios.get(
      `https://se3l85r4x5.execute-api.us-east-2.amazonaws.com/dev/leads`
    ).then((response) => {
      console.log(response.data[0].email);
      console.log(typeof response.data[0].email);

      response.data.forEach((item: any) => {
        if (userEmail === item.email) {
          console.log(item.email);
          console.log(`Found it: ${item.email}`);
          arr.push(item);
          arr[0].isClient = true;
          return arr;
          // console.log(newClient);
        }
      })
    })

    await console.log(arr);
    try {
      await axios.put(
        `https://se3l85r4x5.execute-api.us-east-2.amazonaws.com/dev/leads/${arr[0].id}`
        , {
          isClient: arr[0].isClient,
          id: arr[0].id,
          nome: arr[0].nome,
          email: arr[0].email,
          telefone: arr[0].telefone,
          createdAt: arr[0].createdAt
        })
    } catch (error) {
      console.log(error.response);
    }

    await axios.post(
      `https://se3l85r4x5.execute-api.us-east-2.amazonaws.com/dev/leads/${arr[0].id}`
    )

    // const response = await fetch(
    //   `https://se3l85r4x5.execute-api.us-east-2.amazonaws.com/dev/leads/${emailUser}`
    // );
    // console.log(response);
    // const myJson = await response.json();
    // console.log(myJson);

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