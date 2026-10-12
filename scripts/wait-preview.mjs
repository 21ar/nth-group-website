const base=process.env.NRTH_TEST_URL||'http://127.0.0.1:4173';
const deadline=Date.now()+30000;
while(Date.now()<deadline){
 try{const response=await fetch(base+'/about');if(response.ok()){console.log('Built website responds.');process.exit(0);}}catch{}
 await new Promise(resolve=>setTimeout(resolve,300));
}
throw new Error('The production preview did not become ready within 30 seconds.');
