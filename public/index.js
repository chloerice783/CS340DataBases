
document.addEventListener("DOMContentLoaded", function () {
    //JAVA SCRIPT PART TOP

    //Hide the modal if the 'x' button is clicked
    document.getElementById('modal-close').addEventListener('click', hideModal);
    document.getElementById('insert-entity-button').addEventListener('click', revealModal);

    //Function for hiding the create text modal
    function hideModal(){
        document.getElementById('create-text-modal').classList.add('hidden');
    }

    function revealModal(){

        document.getElementById('create-text-modal').classList.remove('hidden');

    }


    //JAVA SCRIPT PART BOTTOM

});