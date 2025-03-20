const BASEURL = "https://sol-rng.fandom.com/wikia.php"//?

const payload = {
    
  };
  
  const searchParams = new URLSearchParams({
    controller: 'MessageWall',
    method: 'createThread',
    token: "",
    wallOwnerId: '48938858',
    title: "Test",
    rawContent: "TestTest",
  });
  
  fetch(url + searchParams.toString(), {
  method: "POST",
  body: JSON.stringify(payload)
  })
  .then(response => console.log(response))
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));