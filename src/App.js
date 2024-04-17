import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showFormAddFriednd, setShowFormAddFriednd] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleOnClick() {
    setShowFormAddFriednd((show) => !show);
  }
  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowFormAddFriednd(false);
    console.log(selectedFriend);
  }
  function handleOnSplitBill(val) {
    setFriends(() =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + val }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          handleSelection={handleSelection}
        />
        {showFormAddFriednd && (
          <FormAddFriend
            friends={friends}
            setFriends={setFriends}
            onAfterAddFriend={setShowFormAddFriednd}
          />
        )}
        <Button onClick={handleOnClick}>
          {showFormAddFriednd ? "Close" : "Add Friend"}
        </Button>
      </div>
      <FormSplitBill key={selectedFriend?.id}
        selectedFriend={selectedFriend}
        onSplitBill={handleOnSplitBill}
        setSelectedFriend={setSelectedFriend}
      />
    </div>
  );
}
function FriendsList({ friends, handleSelection, selectedFriend }) {
  // const friends = initialFriends;

  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe ${Math.abs(friend.balance)} to {friend.name}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes ${friend.balance} to you
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are equall</p>}
      <Button onClick={() => onSelection(friend)}>
        {" "}
        {isSelected ? "Close" : "Select"}{" "}
      </Button>
    </li>
  );
}

function FormAddFriend({ friends, setFriends, onAfterAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    setFriends([...friends, newFriend]);
    setName("");
    setImage("https://i.pravatar.cc/48");
    onAfterAddFriend(false);
    console.log(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🙆‍♂️Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>ADD</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill, setSelectedFriend }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill - paidByUser;
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleOnSubmit(e) {
    e.preventDefault();
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
    setSelectedFriend(null);
  }
  return (
    selectedFriend && (
      <form className="form-split-bill" onSubmit={(e) => handleOnSubmit(e)}>
        <h2>Split bill with {selectedFriend.name}</h2>
        <label>💰Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />
        <label>🤵Your expense</label>
        <input
          type="text"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > bill
                ? paidByUser
                : Number(e.target.value)
            )
          }
        />
        <label>👩🏼‍🤝‍🧑🏼{selectedFriend.name}'s expense</label>
        <input type="text" disabled value={paidByFriend} />
        <label>🤑who is paying the bill</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
        <Button>Split Bill</Button>
      </form>
    )
  );
}
