let data = {
  users: [
    {
      authUserId: 123456,
      token: 's',
      email: 'jackvanroy@gmail.com',
      nameFirst: 'Jack',
      nameLast: 'van Roy',
      password: 'jackvanroy123',
    },
    {
      uId: 654321,
      token: 's',
      email: 'vanroyjack@outlook.com',
      nameFirst: 'van Roy',
      nameLast: 'Jack',
      password: '321vanroyjack',
    },
  ],
};

export function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
export function setData(newData: any) {
  data = newData;
}
