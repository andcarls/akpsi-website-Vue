import { createStore } from 'vuex'
import { supabase } from '@/lib/supabase';

export default createStore({
  state: {
    mData: null,
    bData: null,
    aData: null,
    needsUpdate: null,
    lastUpdated: null,
    userName: null,
    userDataLoaded: false,
    charges: null,
    paidCharges: null,
    financeDataLoaded: false,
  },
  getters: {
    getMData(state) {
      return state.mData;
    },
    getAData(state) {
      return state.aData;
    },
    getBData(state) {
      return state.bData;
    },
    getNeedsUpdate(state) {
      return state.needsUpdate;
    },
    getUserName(state) {
      return state.userName;
    },
    getLastUpdated(state) {
      return state.lastUpdated;
    },
    getCharges(state) {
      return state.charges;
    },
    getPaidCharges(state) {
      return state.paidCharges;
    }
  },
  mutations: {
    setMData(state, newData) {
      state.mData = newData;
    },
    setAData(state, newData) {
      state.aData = newData;
    },
    setBData(state, newData) {
      state.bData = newData;
    },
    setNeedsUpdate(state, newData) {
      state.needsUpdate = newData;
    },
    setUserName(state, newData) {
      state.userName = newData;
    },
    setLastUpdated(state, newData) {
      state.lastUpdated = newData;
    },
    setCharges(state, newData) {
      state.charges = newData;
    },
    setPaidCharges(state, newData) {
      state.paidCharges = newData;
    }
  },
  actions: {
    async loadAll() {
      await this.dispatch('fetchUserData');
      await this.dispatch('fetchFinanceData');
      await this.dispatch('fetchMemberData');
      await this.dispatch('fetchBData');
      await this.dispatch('fetchAData');
    },
    async fetchUserData() {
      if (this.state.userDataLoaded) {
        return;
      }
      // Set user name
      const { data } = await supabase.auth.getSession();
      let session = data.session;
      let { data: result } = await supabase
        .from('user_information')
        .select(`last_updated, 
                first_name, 
                last_name, 
                uniqname, 
                graduation_year, 
                college,
                phone,
                major,
                minor,
                clubs,
                internships,
                full_time,
                personal_email
                `)
        .eq('user_id', session.user.id)
        .single();
      let userName = result.first_name;
      this.commit('setUserName', userName);

      // Check last profile update -- if >= 4 months, return true
      // For profile to be reupdated
      let lastUpdate = new Date(result.last_updated);
      let today = new Date();
      const yearsDiff = today.getFullYear() - lastUpdate.getFullYear();
      const monthsDiff = today.getMonth() - lastUpdate.getMonth();
      if (yearsDiff * 12 + monthsDiff >= 4) {
        lastUpdate = yearsDiff * 12 + monthsDiff;
        this.commit('setLastUpdated', lastUpdate);
        this.commit('setNeedsUpdate', true);
      }
      else {
        this.commit('setNeedsUpdate', false);
      }
      this.state.userDataLoaded = true;
    },
    async fetchFinanceData() {
      if (this.state.financeDataLoaded) {
        return;
      }
      let data;
      try {
        const { data: queryData, error } = await supabase
          .from('user_charges')
          .select(`
                    amount,
                    paid,
                    due_date,
                    notes,
                    events (event_name, event_date)
                    `);
        if (error) {
          throw error;
        }
        data = queryData;
      }
      catch (error) {
        alert(error.message);
      }
      finally {
        if (data.length != 0) {
          // unpaid charges
          let charges = data
            .filter(item => item.paid === false)
            .map(item => ({
              'Event': item.events.event_name ? item.events.event_name : 'n/a',
              'Event Date': item.events.event_date ? item.events.event_date : '...',
              'Amount Due': item.amount ? item.amount : 'n/a',
              'Due Date': item.due_date ? item.due_date : '...',
              'Notes': item.notes ? item.notes : '...',
            }));
          // paid charges
          let paidCharges = data
            .filter(item => item.paid === true)
            .map(item => ({
              'Event': item.events.event_name ? item.events.event_name : 'n/a',
              'Event Date': item.events.event_date ? item.events.event_date : '...',
              'Amount Due': item.amount ? item.amount : 'n/a',
              'Due Date': item.due_date ? item.due_date : '...',
              'Notes': item.notes ? item.notes : '...',
            }));
          if (charges.length === 0) {
            charges = null;
          }
          if (paidCharges.length === 0) {
            paidCharges = null;
          }
          this.commit('setCharges', charges);
          this.commit('setPaidCharges', paidCharges);
        }
        this.state.financeDataLoaded = true;
      }
    },
    async fetchMemberData() {
      if (this.state.dataLoaded) {
        return;
      }

      let data;
      try {
        // Get member data, sorted by last name
        const { data: queryData, error } = await supabase
          .from('user_information')
          .select(`
                    first_name,
                    last_name,
                    email,
                    phone,
                    graduation_year,
                    college,
                    major,
                    minor,
                    clubs,
                    internships,
                    full_time,
                    personal_email
                    `)
          .order('last_name');
        if (error) { throw error; }
        else { data = queryData }
      }
      catch (error) {
        alert(error.message);
      }
      this.commit('setMData', data);
    },
    async fetchBData() {
      if (this.state.bData) {
        return;
      }
      await this.dispatch('fetchMemberData');
      if (this.state.mData.length != 0) {
        let currDate = new Date();
        let gradYear;
        if (currDate.getMonth() > 6) {
          gradYear = currDate.getFullYear();
        }
        else {
          gradYear = currDate.getFullYear() - 1;
        }
        let bInfo = this.state.mData
          .filter(item => item.graduation_year > gradYear);
        if (bInfo.length > 0) {
          bInfo = bInfo
            .map(item => ({
              'Name': item.first_name || item.last_name ? item.first_name + ' ' + item.last_name : '...',
              'Email': item.email ? item.email : '...',
              'Phone': item.phone ? item.phone : '...',
              'Grad year': item.graduation_year ? item.graduation_year : '...',
              'College(s)': item.college || '...',
              'Major(s)': item.major || '...',
              'Minor(s)': item.minor || '...',
              'Club(s)': item.clubs || '...',
              'Internship(s)': item.internships || '...',
              'Full Time': item.full_time || '...',
            }));
        }
        else {
          bInfo = null;
        }
        this.commit('setBData', bInfo);
      }
    },
    async fetchAData() {
      if (this.state.aData) {
        return;
      }
      await this.dispatch('fetchMemberData');
      if (this.state.mData.length != 0) {
        let currDate = new Date();
        let gradYear;
        if (currDate.getMonth() > 6) {
          gradYear = currDate.getFullYear();
        }
        else {
          gradYear = currDate.getFullYear() - 1;
        }
        let alumniInfo = this.state.mData
          .filter(item => item.graduation_year <= gradYear);
        if (alumniInfo.length > 0) {
          alumniInfo = alumniInfo
            .map(item => ({
              'Name': item.first_name || item.last_name ? item.first_name + ' ' + item.last_name : '...',
              'Email': item.email ? item.email : '...',
              'Personal Email': item.personal_email || '...',
              'Phone': item.phone ? item.phone : '...',
              'Grad year': item.graduation_year ? item.graduation_year : '...',
              'College(s)': item.college || '...',
              'Major(s)': item.major || '...',
              'Minor(s)': item.minor || '...',
              'Club(s)': item.clubs || '...',
              'Internship(s)': item.internships || '...',
              'Full Time': item.full_time,
            }));
        }
        else {
          alumniInfo = null;
        }
        this.commit('setAData', alumniInfo);
      }

    },
  },
  modules: {
  }
})
