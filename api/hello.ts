export const config = {
  runtime: 'edge', // this is a pre-requisite
  regions: ['iad1'], // only execute this function on iad1
};

export default (req: Request) => {
  return new Response(`Hello, from ${req.url} I'm now an Edge Function!`);
};
