
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