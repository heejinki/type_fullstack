import { Post, PromiseRpc, User, Comment } from "./rpcgen";

const server: PromiseRpc = {
  //서버 변수에 PromiseRPC의 기본 틀을 잡는다.
  createPost: async (req) => {
    //데이터 추가
    posts.push({
      body: req.body,
      comments: [],
      id: posts.length,
      author: user,
      timestamp: Date.now(),
    });
    return {}; //그냥 값을 반환하는것 처럼 보여도 외부적으fh Promise가 붙음
  },
  createComment: async (req) => {
    //댓글추가
    const post = findPost(req.postId);
    post.comments.push({
      id: post.comments.length,
      author: user,
      body: req.body,
      timestamp: Date.now(),
    });
    return {};
  },
  readPost: async (req) => {
    return { post: findPost(req.postId) };
  },
  readRandomPost: async () => {
    return { post: findPost(Math.floor(Math.random() * posts.length)) };
  },
  readProfile: async () => {
    return { user };
  },
  readPreview: async () => {
    //미리보기 구현
    const comments: Comment[] = [];
    posts.forEach((p) => {
      p.comments.forEach((c) => {
        if (c.author.id === user.id) {
          comments.push(c);
        }
      });
    });

    return { posts: posts.filter((p) => p.author.id === user.id), comments };
  },
  updateProfile: async (req) => {
    user.name = req.name;
    return {};
  },
};

export default server;

const user: User = { id: 3, name: "내 이름" }; //유저라는 정보로 로그인이된 상태.
const user2: User = { id: 4, name: "다른 유저" };
const posts: Post[] = [
  //더미데이터
  {
    id: 0,
    body: "내용1",
    author: user,
    timestamp: Date.now() - 2345432,
    comments: [],
  },
  {
    id: 1,
    body: "내용2",
    author: user2,
    timestamp: Date.now() - 2131231231,
    comments: [{ body: "댓글2", author: user2, timestamp: Date.now(), id: 2 }],
  },
  {
    id: 2,
    body: "내용3",
    author: user2,
    timestamp: Date.now(),
    comments: [{ body: "댓글1", author: user, timestamp: Date.now(), id: 1 }],
  },
];

function findPost(postId: number): Post {
  //아이디로 글을 찾고 없으면 예외를 던지는 함수.
  const post = posts.find((p) => p.id === postId); //그냥 find만 쓰면 undefined 에 대한 타입처리를 항상 해줘야되어 함수로 따로 뺴줌.
  if (!post) {
    throw Error("no post");
  }
  return post;
}
