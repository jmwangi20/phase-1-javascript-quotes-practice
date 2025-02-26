document.addEventListener("DOMContentLoaded",() => {
    const quoteList  = document.getElementById("quote-list")
    const newQuoteForm = document.getElementById("new-quote-form")

    // create a function to fetch all the quotes and render them to the page 
    function fetchQuotes() {
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(response => response.json())
        .then(quotes => {
            quoteList.innerHTML = "";
            quotes.forEach(quote => renderQuote(quote))
        })
    }

    // Create a function to render the quotes to the page 
    function renderQuote(quote){
        const li = document.createElement("li")
        li.className = "quote-card"
        li.innerHTML = `
       <blockquote class = "blockquote">
       <p class = "mb-0">${quote.quote}</p>
       <footer class = "blockquote-footer">${quote.author}</footer>
       <br>
       <button class = "btn-success">Likes:<span>${quote.likes?quote.likes.length : 0} </span> </button>
       <button class = "btn-danger">Delete</button>
       </blockquote>
        `

        // add an event listener to handle the like button click
        const likeButton = li.querySelector(".btn-success")
        likeButton.addEventListener("click",() => likeQuote(quote))

        //Add an event listener to handle the delele button event 
        const deleteButton = li.querySelector(".btn-danger")
        deleteButton.addEventListener("click", () => deleteQuote(quote.id))

        // append the lists to the quotelist 
        quoteList.appendChild(li)
    }

    // create a function to handle the form submission
    newQuoteForm.addEventListener("submit",(event) => {
        event.preventDefault()

        const newQuote = { 
            quote : newQuoteForm.quote.value,
            author : newQuoteForm.author.value,
        }
        fetch("http://localhost:3000/quotes",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Accept : "application/json"

            },
            body:JSON.stringify(newQuote)
        })
        .then(response => response.json())
        .then(quote => {
            renderQuote(quote) //add a newquote and refetch the data from the server again,loaded data will contain new quotes 
            newQuoteForm.reset()
        })
        .catch(error => console.error("Error Posting data to the server :",error))
    })

    // Add a function to add likes to the quotes 
    function likeQuote(quote){
        const like = {quoteId : quote.id}
        fetch("http://localhost:3000/likes", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Accept : "application/json",
            },
            body:JSON.stringify(like)    
        })
        .then(response => response.json())
        .then(() => fetchQuotes())
        .catch(error => console.error("Error liking the post :",error))

    }

    // function to delete a post 
    function deleteQuote(quoteid){
        fetch(`http://localhost:3000/quotes/${quoteid}`,{
            method : "DELETE",

        })
        .then(response => {
            if(response.ok){
                fetchQuotes()
            }
        })
        .catch(error => console.error("Error deleting data from the database :",error))
    }

    fetchQuotes() //load and fetch the data from the server once the pagse is loaded 
})