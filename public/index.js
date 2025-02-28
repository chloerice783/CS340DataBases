
document.addEventListener("DOMContentLoaded", function () {
    //JAVA SCRIPT PART TOP

    //Hide the modal if the 'x' button is clicked
    const buttons = document.getElementsByClassName('modal-hide-button');
    for (let button of buttons) {
        button.addEventListener('click', hideModal);
    }
    document.getElementById('update_button').addEventListener('click', revealUpdateModal);
    document.getElementById('delete_button').addEventListener('click', revealDeleteModal);
    document.getElementById('add_button').addEventListener('click', revealAddModal);

    document.getElementById('submit_button').addEventListener('click', getNewCustomer);

    //Function for hiding the create text modal
    function hideModal(){
        const modals = document.getElementsByClassName('entity-modal-overlay')
        for (let modal of modals) {
            modal.classList.add('hidden');
        }
    }

    function revealAddModal(){

        document.getElementById('create-overlay').classList.remove('hidden');
        console.log("Revealing modal")

    }

    function getNewCustomer(){
        var customer_name = document.querySelector("#customerName").value;
        var phone_number = document.querySelector("#phoneNumber").value;
        var email = document.querySelector("#email").value;

        const newCustomer = {
            name: customer_name,
            phoneNumber: phone_number, 
            email: email
        }

        fetchCustomer(newCustomer)
    }

        
    function fetchCustomer(newCustomer){
        fetch('/customers/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCustomer)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Optionally, reload the texts data from the server to update the view
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function revealUpdateModal(){

        document.getElementById('update-overlay').classList.remove('hidden');
        console.log("updating modal")

    }

    function revealDeleteModal(){

        document.getElementById('delete-overlay').classList.remove('hidden');
        console.log("Deleting modal")

    }

    //JAVA SCRIPT PART BOTTOM

});