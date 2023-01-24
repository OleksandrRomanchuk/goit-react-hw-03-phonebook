import { Component } from "react";
import { nanoid } from "nanoid";
import { saveDataToLocalSt, loadDataFromLocalSt } from "helpers/localStfunc";

//========== components ==========
import { Section } from "components/Section/Section";
import { ContactForm } from "components/ContactForm/ContactForm";
import { Filter } from "components/Filter/Filter";
import { Notification } from "components/Notification/Notification";
import { ContactList } from "components/ContactList/ContactList";

//========== styles ==========
import { PhonebookApp, Container, Title, Wrapper } from './App.styled';

const LS_KEY = 'contacts';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() { 
    const savedContacts = loadDataFromLocalSt(LS_KEY);

    if (savedContacts) {
      this.setState({contacts: savedContacts})
    }
  };

  componentDidUpdate(_, prevState) { 
    const { contacts } = this.state;

    if (prevState.contacts !== this.state.contacts) {
      saveDataToLocalSt(LS_KEY, contacts);
    }
  };

  addNewContact = (newContact) => {
    if (this.checkNewContact(newContact.name)) {
      alert(`${newContact.name} is already in contacts.`);
      return true;
    }

    this.setState({ contacts: [{ id: nanoid(), ...newContact }, ...this.state.contacts] });
  }

  deleteContact = (dataId) => {
    this.setState((prevState) => {
      return { contacts: prevState.contacts.filter(contact => contact.id !== dataId) }
    });
  };

  setFilterWord = (event) => {
    this.setState({ filter: event.target.value.trim(), });
  };

  filteredContacts = () => {
    const normalizeFilterWord = this.state.filter.toLowerCase();

    return this.state.contacts.filter(({ name }) => name.toLowerCase().includes(normalizeFilterWord))
  };

  checkNewContact = (newName) => {
    return this.state.contacts.some(({ name }) => name === newName);
  }
  
  render() {
    const contacts = this.state.contacts;
    const contacsCount = contacts.length;

    return (
      <PhonebookApp>
        <Container>
          <Title>Phonebook</Title>
          <Wrapper>
            <Section title="Form to add contacts">
              <ContactForm
                getNewContactData={this.addNewContact} />
            </Section>
            
            <Section title="Contacts">
              {!contacsCount
                ? <Notification
                  message="There are no contacts" />
                : <>
                  <Filter
                    onChange={this.setFilterWord} />
                  <ContactList
                    contacts={this.filteredContacts()}
                    deleteContact={this.deleteContact} />
                </>}
            </Section>
          </Wrapper>
        </Container>
      </PhonebookApp>
    );
  };
};

export { App };