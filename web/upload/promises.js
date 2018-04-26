async function promises() {
  const url = '/api/promises';

  const response = await fetch(url);

  if (response.ok) {
    console.log('Promise Received!')
  } else {
    console.error('Error retrieving the promise', response.status, response.statusText);
  };
};
