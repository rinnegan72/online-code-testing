import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, addDoc, updateDoc, onSnapshot, query, where, orderBy
} from 'firebase/firestore'
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signOut
} from "firebase/auth";

var firebaseConfig = {
    apiKey: "AIzaSyAYRmjnYZB0T8Vm1FCoMU6pgKKr5IXYw20",
    authDomain: "mvp2-f8016.firebaseapp.com",
    projectId: "mvp2-f8016",
    storageBucket: "mvp2-f8016.appspot.com",
    messagingSenderId: "884688264943",
    appId: "1:884688264943:web:8dfd7dde9d9e3dba03051a"
  }
var app;
var auth; 
var db;
var colRef; 
var user; 
var editor; 
var prog_code; 
var prog_title; 

//------------------------------------------------------------------------
//Kept outside as it is common for multiple pages. 

//Script for logout
const logout = document.getElementById('logout');

if (logout) {
  logout.addEventListener('click', () => {
    // Sign out the user using the Firebase Auth API
    auth.signOut()
      .then(() => {
        // Sign-out successful
        console.log('User signed out');
        window.location.href = 'index.html';
      })
      .catch((error) => {
        // An error happened
        console.error('Error signing out:', error);
      });
  });
}

//------------------------------------------------------------------------
//Kept outside as it is common for multiple pages. 
    //Script for mode shift
    //if statement to check if element with id "mode_shift" exists
    const modeShift = document.getElementById('mode_shift');

    if (modeShift) {
      modeShift.addEventListener('click', () => {
        ToggleDarkMode();
      });
      let isDarkMode=window.matchMedia('(prefers-color-scheme:dark)').matches;
      if(isDarkMode)
      {
        //console.log('dark Mode!!')
        ToggleDarkMode();
      }
      else
      {
        //console.log('White Mode')
      }
    }

    function ToggleDarkMode()
    {
      var element=document.body;
      element.classList.toggle('dark');
    }


//------------------------------------------------------------------------
//Kept outside as it is common for multiple pages. 
    // Get references to the explanatory section and toggle link
    var explanatorySection = document.getElementById("explanatory-section");
    var toggleLink = document.getElementById("toggle-link");
    if (toggleLink)
    {
      // Add a click event listener to the toggle link
      toggleLink.addEventListener("click", function (event) {
      // Prevent the default link behavior
      event.preventDefault();

      // Toggle the visibility of the explanatory section
      if (explanatorySection.style.display === "none") {
        explanatorySection.style.display = "block";
      } else {
        explanatorySection.style.display = "none";
      }
    });
    }

//Script for index.html
async function loadIndex()
{ 
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ hd: "cmrit.ac.in", prompt: 'select_account' });
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  document.getElementById("googleauth").addEventListener("click", () => {
  document.getElementById("demo").innerHTML = Date();
  signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        user = result.user;
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          console.log("logged in  ", uid, " in Sign In With Popup");
          console.log("User mail is "+ user.email); 
          //the firestore functions
          db = getFirestore()
          // collection ref
          colRef = collection(db, 'User')
          const q = query(colRef, where("Email_Id", "==", auth.currentUser.email));
          getDocs(q).then((querySnapshot) => {
            const count = querySnapshot.size;
            console.log("users length in Load Index  ",count);
              if (count ===  0)
              {
                console.log("user ",user.uid, user.email, user.displayName)
                app = initializeApp(firebaseConfig);
                db = getFirestore();
                colRef = collection(db, 'User')
                console.log(db, colRef)
                // adding docs
                addDoc(colRef, {
                  User_Id: user.uid,
                  Email_Id: user.email,
                  Name: user.displayName
                }).then(() => {
                  console.log("Document added successfully");
                  createBlankPrograms(user.uid);                     
                }).catch((error) => {
                  console.error("Error adding document: ", error);
                }).finally(() => {
                  console.log("addDoc operation completed");
                });
              }
              else
              {
                console.log("user exists");
                window.location.href ='dashboard.html';  
              }
            });
    }
  }) //signIn ends here
}) //addListener on click

      onAuthStateChanged(auth, (user) => {
        let userName;
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          console.log("logged in  ", uid, " onauth in OnAuth State changed");
          userName = auth.currentUser.displayName; 
          console.log("currentUser  "+auth.currentUser.displayName+" in OnAuth State changed"); 
        } else {
          // User is signed out
          // ...
        }
      });

      signOut(auth).then(() => {
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
      });
//Here are the other scripts for index.html
async function createBlankPrograms(userId) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("inside create blank program");
  db = getFirestore();
  const codeCol = collection(db, "Code");
  let promises = [];
    const data = [
      // Java programs
      {
        Language_Id: "1",
        Program_Code:
          "public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}",
        Program_No: "1",
        Program_Title: "Hello World in Java",
      },
      {
        Language_Id: "1",
        Program_Code:
          "public class Sum {\n  public static void main(String[] args) {\n    int a = 5;\n    int b = 10;\n    int sum = a + b;\n    System.out.println(\"The sum of \" + a + \" and \" + b + \" is \" + sum);\n  }\n}",
        Program_No: "2",
        Program_Title: "Calculate the sum of two numbers in Java",
      },
      {
        Language_Id: "1",
        Program_Code:
          "public class NaturalNumbers {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 10; i++) {\n      System.out.println(i);\n    }\n  }\n}",
        Program_No: "3",
        Program_Title: "Print the first 10 natural numbers in Java",
      },
      {
        Language_Id: "1",
        Program_Code:
          "public class EvenOdd {\n  public static void main(String[] args) {\n    int num = 7;\n    if (num % 2 == 0) {\n      System.out.println(num + \" is even\");\n    } else {\n      System.out.println(num + \" is odd\");\n    }\n  }\n}",
        Program_No: "4",
        Program_Title: "Check if a number is even or odd in Java",
      },
      {
        Language_Id: "1",
        Program_Code:
          "public class Factorial {\n  public static void main(String[] args) {\n    int num = 5;\n    int factorial = 1;\n    for (int i = 1; i <= num; i++) {\n      factorial *= i;\n    }\n    System.out.println(\"The factorial of \" + num + \" is \" + factorial);\n  }\n}",
        Program_No: "5",
        Program_Title: "Find the factorial of a number in Java",
      },
      // Python programs
      {

        Language_Id : "2",
        Program_Code: "print(\"Hello, World!\")",
        Program_No: "1",
        Program_Title: "Hello World in Python"
      },
      {

        Language_Id : "2",
        Program_Code: "a = 5\nb =10\nsum = a + b\nprint(f\"The sum of {a} and {b} is {sum}\")",
        Program_No: "2",
        Program_Title: "Calculate the sum of two numbers in Python"
      },
      {

        Language_Id : "2",
        Program_Code: "for i in range(1, 11):\n    print(i)",
        Program_No: "3",
        Program_Title: "Print the first 10 natural numbers in Python"
      },
      {

        Language_Id : "2",
        Program_Code: "num = 7\nif num % 2 == 0:\n    print(f\"{num} is even\")\nelse:\n    print(f\"{num} is odd\")",
        Program_No: "4",
        Program_Title: "Check if a number is even or odd in Python"
      },
      {

        Language_Id : "2",
        Program_Code: "num = 5\nfactorial = 1\nfor i in range(1, num+1):\n    factorial *= i\nprint(f\"The factorial of {num} is {factorial}\")",
        Program_No : "5",
        Program_Title: "Find the factorial of a number in Python"
      },
    
      // Ruby programs
      {

        Language_Id : "3",
        Program_Code: "puts \"Hello, World!\"",
        Program_No: "1",
        Program_Title: "Hello World in Ruby"
      },
      {

        Language_Id : "3",
        Program_Code: "a =5\nb =10\nsum = a + b\nputs \"The sum of #{a} and #{b} is #{sum}\"",
        Program_No: "2",
        Program_Title: "Calculate the sum of two numbers in Ruby"
      },
      {

        Language_Id : "3",
        Program_Code: "(1..10).each do |i|\n   puts i\nend",
        Program_No: "3",
        Program_Title: "Print the first 10 natural numbers in Ruby"
      },
      {

        Language_Id : "3",
        Program_Code: "num =7\nif num.even?\n   puts \"#{num} is even\"\nelse\n   puts \"#{num} is odd\"\nend",
        Program_No: "4",
        Program_Title:"Check if a number is even or odd in Ruby"
        },
        {

        Language_Id : "3",
        Program_Code:"num=5\nfactorial=(1..num).inject(:*)\nputs \"The factorial of #{num} is #{factorial}\"",
        Program_No : "5",
        Program_Title:"Find the factorial of a number in Ruby"
        },
        
        // C++ programs
        {
          Language_Id: "4",
          Program_Code:
            "#include <iostream>\nint main() {\n  std::cout << \"Hello, World!\" << std::endl;\n  return 0;\n}",
          Program_No: "1",
          Program_Title: "Hello World in C++",
        },
        {
          Language_Id: "4",
          Program_Code:
            "#include <iostream>\nint main() {\n  int a = 5;\n  int b = 10;\n  int sum = a + b;\n  std::cout << \"The sum of \" << a << \" and \" << b << \" is \" << sum << std::endl;\n  return 0;\n}",
          Program_No: "2",
          Program_Title: "Calculate the sum of two numbers in C++",
        },
        {
          Language_Id: "4",
          Program_Code:
            "#include <iostream>\nint main() {\n  for (int i = 1; i <= 10; i++) {\n    std::cout << i << std::endl;\n  }\n  return 0;\n}",
          Program_No: "3",
          Program_Title: "Print the first10natural numbers in C++",
        },
        {
          Language_Id: "4",
          Program_Code:
            "#include <iostream>\nint main() {\n  int num = 7;\n  if (num % 2 == 0) {\n    std::cout << num << \" is even\" << std::endl;\n  } else {\n    std::cout << num << \" is odd\" << std::endl;\n  }\n  return 0;\n}",
          Program_No: "4",
          Program_Title: "Check if a number is even or odd in C++",
        },
        {
          Language_Id: "4",
          Program_Code:
            "#include <iostream>\nint main() {\n int num =5;\n int factorial=1;\n for (int i=1; i<=num; i++) {\nfactorial *=i;\n}\nstd::cout<<\"The factorial of \"<<num<<\" is \"<<factorial<<std::endl;\nreturn 0;\n}",
        Program_No : "5",
        Program_Title:"Find the factorial of a number in C++"
        }
        ];

        // loop over the data array and update the User_Id property of each object
        // Save the data to the database
        for (const row of data) {
          row.User_Id = userId;
          const promise = addDoc(codeCol, row);
          promises.push(promise);
        }  
      // Wait for all addDoc operations to complete
      await Promise.all(promises);

    // Redirect user after all documents have been added
    window.location.href ='dashboard.html';
    }
    } //loadIndex ends here
    window.loadIndex = loadIndex;
    //  ---------------------------

// scripts for  Dashboard.html
function loadDashboard()
  { var userId; 
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
            let userName; 
          onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              userName = auth.currentUser.displayName;
              userId =  auth.currentUser.uid; 
              //console.log("currentUser  "+auth.currentUser.displayName+" in OnAuth State changed"+userName); 
              //Update the Heading of the page
              let myHeading = document.getElementById("myHeading");
              myHeading.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="23" height="36" fill="currentColor" class="bi bi-airplane-engines-fill" viewBox="0 0 16 16"><path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0Z"/></svg>' 
                + " CMRIT's CodePilot - " + userName;
              //Create the program links 
              const db = getFirestore()
              // collection ref
              const codeRef = collection(db, 'Code')
              // get collection data
              
              // Define the user and language IDs to filter by
              //const userId = auth.currentUser.uid; 
              //const userId = "Vb116aoM1lXCAO4dM5dUPDqs6Q93"; // replace with the actual user ID  SRIRAM  
              //const userId = "vAYziaY9bMgwHoA1eE5EMxHff502"; //Kevin
              for (let k = 1; k <= 4; k++) {
                let languageId = k.toString(); // replace with the actual language ID
                
                // Add the where clause to filter the data by user and language IDs
                //userId = "gVPWn5QEINcpQV2ByLkMRvFTnto1"; //Rakshit 
                let queryCode = query(codeRef, where('User_Id', '==', userId), where('Language_Id', '==', languageId), orderBy('Program_No'));
                getDocs(queryCode)
                  .then(snapshot => {
                    let programNames = []
                    snapshot.docs.forEach(doc => {
                      programNames.push(doc.data().Program_Title)
                    })
                      //console.log(programNames)
                        //html updates based on the info got from DB
                        const programListIds = {
                          "1": "java-program-list",
                          "2": "python-program-list",
                          "3": "ruby-program-list",
                          "4": "cpp-program-list"
                        };
                        const programList = document.getElementById(programListIds[languageId]);
                        for (let i = 1; i <= 5; i++ ) {
                          const listItem = document.createElement('li');
                          const link = document.createElement('a');
                          link.textContent = programNames[i - 1];
                          link.href = `compiler.html?langNumber=${languageId}&programNumber=${i}`;
                          listItem.appendChild(link);
                          programList.appendChild(listItem);
                          //console.log(link, listItem);
                        }
                  })
                  .catch(err => {
                    console.log(err.message)
                  });
              } //for loop
            } else {
              // User is signed out
              // ...
              console.log("user has signed out"); 
              window.location.href = 'index.html';
            }
          });
    } //loadDashboard
    window.loadDashboard = loadDashboard;
    //  ---------------------------

  //Scripts for generic compiler
function loadCompiler()
{

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const programNumber = params.get('programNumber');
const langNumber = params.get('langNumber');
showPrevNext(langNumber,programNumber); 
//const fileName = url.pathname.split('/').pop();
var dblanguageName ;
    var dblanguageValue;
    var  dbmodeValue ;
    var dbversionIndexValue ;
// Get a reference to the "language" collection
const db = getFirestore(); 
const languageRef = collection(db,'Language');

// Create a query to retrieve a single document where Language_Id is "1"
const queryCode = query(languageRef, where('Language_Id', '==', langNumber)); 
getDocs(queryCode)
.then(snapshot => {
  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    // Access the fields you want from the data object
    dblanguageName = data.Language_Name;
    dblanguageValue = data.Language_value;
    dbmodeValue = data.Mode_value;
    dbversionIndexValue = data.VersionIndex_value;  
    //console.log(data);
  } 
  else 
  {
    // Handle the case where no documents were found
    console.log("No documents")
  }
      //console.log(auth); 
      let userName; 
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          userName = auth.currentUser.displayName; 
          //console.log("currentUser  "+auth.currentUser.displayName+" in OnAuth State changed"+userName); 
        } else {
          // User is signed out
          userName = "Signed out user"; 
          window.alert("user signed out")
          console.log("user has signed out"); 
          window.location.href = 'index.html';
        }
    let myHeading = document.getElementById("myHeading");
    myHeading.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="23" height="36" fill="currentColor" class="bi bi-airplane-engines-fill" viewBox="0 0 16 16"><path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0Z"/></svg>' 
    + " CMRIT's CodePilot - " + userName + " - " + dblanguageName + " - #" + programNumber;
  }); //getDocs   

  const db = getFirestore()
  // collection ref
  const codeRef = collection(db, 'Code')
  // get collection data
  
  // Define the user and language IDs to filter by
  const userId = auth.currentUser.uid; 
  //const userId = "Vb116aoM1lXCAO4dM5dUPDqs6Q93"; // SRIRAM
  //const userId = "vAYziaY9bMgwHoA1eE5EMxHff502"; //Kevin
  //const userId = "gVPWn5QEINcpQV2ByLkMRvFTnto1"; //Rakshit 
  
  var languageId = langNumber.toString(); // replace with the actual language ID

  // Add the where clause to filter the data by user and language IDs
  const queryCode = query(codeRef, where('User_Id', '==', userId), where('Language_Id', '==', languageId), where('Program_No', '==', programNumber));
    getDocs(queryCode)
      .then(snapshot => {
        //console.log("snapshot docs  ", snapshot.docs)
        if (!snapshot.empty) {
          const userCode = snapshot.docs[0].data();
          // Do something with userCode here
          prog_code = userCode.Program_Code;
          prog_title = userCode.Program_Title; 
          //console.log ("log ",prog_code)
        } else {
          // Handle the case where no documents were found
          console.log("No documents")
        }
      var codeArea = document.getElementById("code-area");
      codeArea.value =  prog_code;
      var progName = document.getElementById("program_title");
      progName.value = prog_title; 
      editor = CodeMirror(codeArea, {
        lineNumbers: true,
        mode: dbmodeValue,
        styleActiveLine: true, // add this option
        lineWrapping: true, // optional: enable wrapping of long lines
        indentUnit: 2, // optional: set the number of spaces per indentation level
        value: codeArea.value  
      }); //codemirror      
      }); //getDocs
    });
var clientId = "b44e88917216c6f9e29a4ffd555b2314"; // Replace this with your JDoodle client ID
var clientSecret = "aeb79e574a5bffb63928676ae714d00f828a8cf378a27dc1fad7bde945670b93"; // Replace this with your JDoodle client secret

var apiUrl = "https://cors-anywhere.herokuapp.com/https://api.jdoodle.com/v1/execute";
//var apiUrl = "https://api.jdoodle.com/v1/execute";
var responseElement = document.getElementById("responseArea");
var executeButton = document.getElementById("execute-button");

executeButton.addEventListener("click", function() {
    console.log("executing");
    var code = editor.getValue();
    var requestData = {
      script: code,
      language: dblanguageValue,
      versionIndex: dbversionIndexValue,
      clientId: clientId,
      clientSecret: clientSecret
    };
    //console.log(requestData);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
      responseElement.value = data.output || data.stderr || data.error;
      // Calculate the number of lines in the response text
      var lines = responseElement.value.split("\n").length;
      // Set the rows attribute to the number of lines
      responseElement.rows = lines;
      //console.log(data);
    })
    .catch(error => console.error(error));
});
let closeFlag = false; 
document.getElementById("saveToDB").addEventListener("click", () => {
  saveToDB()
  });
  document.getElementById("saveAndClose").addEventListener("click", () => {
    closeFlag = true 
    //console.log("save and close")
    saveToDB()
  //window.location.href = 'dashboard.html';
  });

  async function saveToDB() {
        // get the code input from the editor and not the textarea 
        var code =  editor.getValue(); 
        //console.log("Saving code ----- ",code);
        
      const db = getFirestore();
      const codeRef = collection(db, 'Code');
    const userId = auth.currentUser.uid; 
    //const userId = "Vb116aoM1lXCAO4dM5dUPDqs6Q93"; // SRIRAM
    //const userId = "vAYziaY9bMgwHoA1eE5EMxHff502"; //Kevin
    //const userId = "gVPWn5QEINcpQV2ByLkMRvFTnto1"; //Rakshit   
      const queryCode = query(codeRef, where('Language_Id', '==', langNumber), where('Program_No', '==', programNumber), where('User_Id', '==',userId)); 
      ////const queryCode = query(codeRef, where('Language_Id', '==', langNumber), where('Program_No', '==', programNumber), where('User_Id', '==',auth.currentUser.uid )); 
      getDocs(queryCode)
      .then(snapshot => {
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        updateDoc(docRef, {
          Program_Code: code,
          Program_Title: document.getElementById("program_title").value
        }).then(() => {
          //console.log(document.getElementById("program_title").value)
          window.alert("Saved Successfully")
          if (closeFlag) {
            window.location.href = 'dashboard.html';
          }
        });
        } else {
        // Handle the case where no documents were found
      }
      });
      }

  async function showPrevNext(langNumber,programNumber) {
    const prevElement = document.querySelector('#Prev');
    const nextElement = document.querySelector('#Next');
    //console.log("Show Prev Next");
    const prevLink = document.createElement('a');
    prevLink.textContent = 'Prev';
    if (parseInt(programNumber, 10) > 1) {
      prevLink.href = `compiler.html?langNumber=${langNumber}&programNumber=${programNumber-1}`;
    } else {
      if (parseInt(langNumber, 10) > 1) {
        prevLink.href = `compiler.html?langNumber=${parseInt(langNumber, 10)-1}&programNumber=${5}`;
      }  
     else {
      prevLink.style.pointerEvents = 'none';
      prevLink.style.opacity = '0.5';
      }
    }
    const nextLink = document.createElement('a');
    nextLink.textContent = 'Next';
    if (parseInt(programNumber, 10) < 4) {
      nextLink.href = `compiler.html?langNumber=${langNumber}&programNumber=${parseInt(programNumber, 10)+1}`;
    } else {
      if (parseInt(langNumber, 10) < 4) {
        nextLink.href = `compiler.html?langNumber=${parseInt(langNumber, 10)+1}&programNumber=${1}`;
      }  
     else {
      console.log("Show Prev Next");
      nextLink.style.pointerEvents = 'none';
      nextLink.style.opacity = '0.5';
    }
    }
    prevElement.appendChild(prevLink);
    nextElement.appendChild(nextLink);
  }

  }; //loadComplier
  window.loadCompiler = loadCompiler;
  //  ---------------------------

//Scripts for FAQs
function loadFaqs()
{
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
      console.log(auth); 
      let userName; 
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          userName = auth.currentUser.displayName; 
          //console.log("currentUser  "+auth.currentUser.displayName+" in OnAuth State changed"+userName); 
        } else {
          // User is signed out
          userName = "Signed out user"; 
          window.alert("user signed out")
          console.log("user has signed out"); 
          window.location.href = 'index.html';
        }
    let myHeading = document.getElementById("myHeading");
    myHeading.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="23" height="36" fill="currentColor" class="bi bi-airplane-engines-fill" viewBox="0 0 16 16"><path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0Z"/></svg>' 
    + " CMRIT's CodePilot - " + userName;
  }); //getDocs   
  }; //loadFaqs
  window.loadFaqs = loadFaqs;
  //  ---------------------------
