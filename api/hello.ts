export const config = {
  runtime: 'edge', // this is a pre-requisite
  // regions: ['iad1'], // only execute this function on iad1
};

export default (req: Request) => {
  // console.log({ url: req.url, req }) ${ req.url }
  return new Response(`Hello, from  I'm now an Edge Function!`);
};
