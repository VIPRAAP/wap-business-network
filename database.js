/* ============================================================
   WAP DATABASE ENGINE & SUPABASE CONNECTIVITY
============================================================ */

class DatabaseService {
  constructor() {
    this.useSupabase = false;
    this.supabaseClient = null;
    this.initSupabase();
    
    // Seed mock database in localStorage if empty
    this.seedMockDatabase();
  }

  // 1. Initialize Supabase if keys exist in localStorage
  initSupabase() {
    const url = localStorage.getItem('wap_supabase_url');
    const key = localStorage.getItem('wap_supabase_key');

    if (url && key) {
      try {
        // Supabase is loaded globally via CDN script in our HTML files
        if (typeof supabase !== 'undefined') {
          this.supabaseClient = supabase.createClient(url, key);
          this.useSupabase = true;
          console.log("Supabase Client initialized successfully!");
        } else {
          console.warn("Supabase library not loaded yet.");
        }
      } catch (err) {
        console.error("Error creating Supabase client:", err);
        this.useSupabase = false;
      }
    } else {
      console.log("Using Local Database Mode (Out-of-the-box local storage).");
      this.useSupabase = false;
    }
  }

  // Helper: Save Supabase keys and test connectivity
  saveSupabaseConfig(url, key) {
    if (!url || !key) {
      localStorage.removeItem('wap_supabase_url');
      localStorage.removeItem('wap_supabase_key');
      this.useSupabase = false;
      this.supabaseClient = null;
      return { success: true, message: "Cleared Supabase keys. Switched to Local Storage Database Mode." };
    }

    try {
      localStorage.setItem('wap_supabase_url', url);
      localStorage.setItem('wap_supabase_key', key);
      this.initSupabase();
      return { success: true, message: "Supabase configuration updated and saved!" };
    } catch (err) {
      return { success: false, message: "Failed to configure Supabase: " + err.message };
    }
  }

  // 2. Local Database Seeding (Pre-populate realistic profiles and posts)
  seedMockDatabase() {
    if (!localStorage.getItem('wap_db_users')) {
      const mockUsers = [
        {
          id: "usr_diipaal",
          email: "diipaal@weareprofessionals.in",
          full_name: "Diipaal Mehta",
          company: "WAP Business Network",
          domain: "Business Consulting",
          designation: "Founder & Organizer",
          experience: "15+ Years",
          mobile: "9920551929",
          city: "Mumbai",
          website: "www.weareprofessionalswap.in",
          avatar_url: ""
        },
        {
          id: "usr_rahul",
          email: "rahul@technova.com",
          full_name: "Rahul Mehta",
          company: "TechNova Solutions",
          domain: "SaaS & Tech",
          designation: "CEO",
          experience: "12+ Years",
          mobile: "9820490339",
          city: "Mumbai",
          website: "www.technovasolutions.in",
          avatar_url: ""
        },
        {
          id: "usr_priya",
          email: "priya@designcurry.in",
          full_name: "Priya Sharma",
          company: "DesignCurry Studio",
          domain: "Creative Arts & Branding",
          designation: "Creative Director",
          experience: "8+ Years",
          mobile: "9820744393",
          city: "Mumbai",
          website: "www.designcurry.in",
          avatar_url: ""
        },
        {
          id: "usr_amit",
          email: "amit@patellogistics.com",
          full_name: "Amit Patel",
          company: "Patel Logistics",
          domain: "Supply Chain & Logistics",
          designation: "Managing Partner",
          experience: "10+ Years",
          mobile: "9867801451",
          city: "Navi Mumbai",
          website: "www.patellogistics.com",
          avatar_url: ""
        },
        {
          id: "usr_sneha",
          email: "sneha@iyerassociates.com",
          full_name: "Sneha Iyer",
          company: "Iyer Corporate Law",
          domain: "Legal Services",
          designation: "Senior Advocate",
          experience: "14+ Years",
          mobile: "9892799460",
          city: "Mumbai",
          website: "www.iyerassociates.com",
          avatar_url: ""
        }
      ];
      localStorage.setItem('wap_db_users', JSON.stringify(mockUsers));
    }

    if (!localStorage.getItem('wap_db_posts')) {
      const mockPosts = [
        {
          id: "post_1",
          user_id: "usr_rahul",
          author_name: "Rahul Mehta",
          author_company: "TechNova Solutions",
          type: "product",
          content: "🚀 Excited to announce our new enterprise SaaS billing platform! Looking for distribution partners and system integrators across Western India. 12+ years of enterprise tech experience backing this. Let's connect at the WAP weekly meetups!",
          likes_count: 24,
          created_at: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
        },
        {
          id: "post_2",
          user_id: "usr_diipaal",
          author_name: "Diipaal Mehta",
          author_company: "WAP Business Network",
          type: "update",
          content: "📢 Proud to announce our upcoming WAP 86th Business Networking Meeting this Friday, March 27, 2024 at Malad, Mumbai! Let's scale up. Make sure to invite entrepreneurs who are eager to expand their network and business networth! Check the Events tab to RSVP and complete payment.",
          likes_count: 38,
          created_at: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
        },
        {
          id: "post_3",
          user_id: "usr_priya",
          author_name: "Priya Sharma",
          author_company: "DesignCurry Studio",
          type: "achievement",
          content: "🎉 We just completed the identity branding design for our 100th client! Special thanks to fellow WAP members for the high-quality business referrals. Entrepreneurship is a journey, and having a trusted network of handshakes makes it incredible! 🤝✨",
          likes_count: 42,
          created_at: new Date(Date.now() - 3600000 * 24).toISOString() // 24 hours ago
        },
        {
          id: "post_4",
          user_id: "usr_amit",
          author_name: "Amit Patel",
          author_company: "Patel Logistics",
          type: "networking",
          content: "📦 Expanding our warehouse capabilities in Bhiwandi to 50,000 sq ft! Any MSME or business owner looking for flexible 3PL supply chain distribution solutions or cost-effective logistics, please reach out to me directly or view my profile. Let's synergize!",
          likes_count: 15,
          created_at: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
        }
      ];
      localStorage.setItem('wap_db_posts', JSON.stringify(mockPosts));
    }

    if (!localStorage.getItem('wap_db_connections')) {
      const mockConnections = [
        { id: "conn_1", user_id: "usr_diipaal", connected_user_id: "usr_rahul", status: "connected" },
        { id: "conn_2", user_id: "usr_diipaal", connected_user_id: "usr_priya", status: "connected" },
        { id: "conn_3", user_id: "usr_priya", connected_user_id: "usr_rahul", status: "connected" }
      ];
      localStorage.setItem('wap_db_connections', JSON.stringify(mockConnections));
    }

    if (!localStorage.getItem('wap_db_rsvps')) {
      const mockRsvps = [
        { id: "rsvp_1", user_id: "usr_rahul", user_name: "Rahul Mehta", event_id: "evt_86", amount: 651, utr_number: "UTR987654321", status: "verified", created_at: new Date().toISOString() }
      ];
      localStorage.setItem('wap_db_rsvps', JSON.stringify(mockRsvps));
    }
  }

  // 3. Profiles & Users CRUD
  async registerUser(userData) {
    if (this.useSupabase) {
      try {
        const { data, error } = await this.supabaseClient
          .from('profiles')
          .insert([{
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name,
            company: userData.company,
            domain: userData.domain,
            designation: userData.designation,
            experience: userData.experience,
            mobile: userData.mobile,
            city: userData.city,
            website: userData.website,
            avatar_url: userData.avatar_url || ""
          }]);
        
        if (error) throw error;
        return { success: true, user: userData };
      } catch (err) {
        console.error("Supabase Profile Registration Error:", err);
        return { success: false, message: err.message };
      }
    } else {
      // Local Storage Registration
      const users = JSON.parse(localStorage.getItem('wap_db_users') || '[]');
      if (users.some(u => u.email === userData.email)) {
        return { success: false, message: "User with this email already exists." };
      }
      users.push(userData);
      localStorage.setItem('wap_db_users', JSON.stringify(users));
      return { success: true, user: userData };
    }
  }

  async loginUser(email, password) {
    // For demo purposes, we do a basic email check
    if (this.useSupabase) {
      try {
        const { data, error } = await this.supabaseClient
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !data) {
          throw new Error(error ? error.message : "User profile not found in Supabase.");
        }
        return { success: true, user: data };
      } catch (err) {
        console.error("Supabase Login Error:", err);
        return { success: false, message: err.message };
      }
    } else {
      const users = JSON.parse(localStorage.getItem('wap_db_users') || '[]');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { success: false, message: "Email not registered. Please sign up!" };
      }
      return { success: true, user };
    }
  }

  async getProfile(userId) {
    if (this.useSupabase) {
      try {
        const { data, error } = await this.supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase Get Profile Error:", err);
        return null;
      }
    } else {
      const users = JSON.parse(localStorage.getItem('wap_db_users') || '[]');
      return users.find(u => u.id === userId) || null;
    }
  }

  async getAllMembers() {
    if (this.useSupabase) {
      try {
        const { data, error } = await this.supabaseClient
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase Get Members Error:", err);
        return JSON.parse(localStorage.getItem('wap_db_users') || '[]');
      }
    } else {
      return JSON.parse(localStorage.getItem('wap_db_users') || '[]');
    }
  }

  // 4. Feed & Posts CRUD
  async createPost(postData) {
    if (this.useSupabase) {
      try {
        const { data, error } = await this.supabaseClient
          .from('posts')
          .insert([{
            id: postData.id,
            user_id: postData.user_id,
            author_name: postData.author_name,
            author_company: postData.author_company,
            type: postData.type,
            content: postData.content,
            likes_count: 0
          }]);
        if (error) throw error;
        return { success: true, post: postData };
      } catch (err) {
        console.error("Supabase Create Post Error:", err);
        return { success: false, message: err.message };
      }
    } else {
      const posts = JSON.parse(localStorage.getItem('wap_db_posts') || '[]');
      posts.unshift(postData);
      localStorage.setItem('wap_db_posts', JSON.stringify(posts));
      return { success: true, post: postData };
    }
  }

  async getAllPosts() {
    if (this.useSupabase) {
      try {
        const { data, error } = await this.supabaseClient
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase Get Posts Error:", err);
        return JSON.parse(localStorage.getItem('wap_db_posts') || '[]');
      }
    } else {
      return JSON.parse(localStorage.getItem('wap_db_posts') || '[]');
    }
  }

  async likePost(postId) {
    if (this.useSupabase) {
      try {
        // Increment likes count directly in Supabase
        const { data: post } = await this.supabaseClient.from('posts').select('likes_count').eq('id', postId).single();
        const nextLikes = (post?.likes_count || 0) + 1;
        const { error } = await this.supabaseClient
          .from('posts')
          .update({ likes_count: nextLikes })
          .eq('id', postId);
        if (error) throw error;
        return nextLikes;
      } catch (err) {
        console.error("Supabase Like Post Error:", err);
        return 0;
      }
    } else {
      const posts = JSON.parse(localStorage.getItem('wap_db_posts') || '[]');
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.likes_count = (post.likes_count || 0) + 1;
        localStorage.setItem('wap_db_posts', JSON.stringify(posts));
        return post.likes_count;
      }
      return 0;
    }
  }

  // 5. Connections Management
  async connectUsers(userId, targetUserId) {
    if (this.useSupabase) {
      try {
        const connectionId = `conn_${userId}_${targetUserId}`;
        const { error } = await this.supabaseClient
          .from('connections')
          .insert([{
            id: connectionId,
            user_id: userId,
            connected_user_id: targetUserId,
            status: "connected"
          }]);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error("Supabase Connection Error:", err);
        return { success: false, message: err.message };
      }
    } else {
      const connections = JSON.parse(localStorage.getItem('wap_db_connections') || '[]');
      const exists = connections.some(c => 
        (c.user_id === userId && c.connected_user_id === targetUserId) || 
        (c.user_id === targetUserId && c.connected_user_id === userId)
      );
      if (!exists) {
        connections.push({
          id: `conn_${Date.now()}`,
          user_id: userId,
          connected_user_id: targetUserId,
          status: "connected"
        });
        localStorage.setItem('wap_db_connections', JSON.stringify(connections));
      }
      return { success: true };
    }
  }

  async getConnections(userId) {
    if (this.useSupabase) {
      try {
        const { data, error } = await this.supabaseClient
          .from('connections')
          .select('*')
          .or(`user_id.eq.${userId},connected_user_id.eq.${userId}`);
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase Get Connections Error:", err);
        return [];
      }
    } else {
      const connections = JSON.parse(localStorage.getItem('wap_db_connections') || '[]');
      return connections.filter(c => c.user_id === userId || c.connected_user_id === userId);
    }
  }

  // 6. Events & RSVPs
  async createRsvp(rsvpData) {
    if (this.useSupabase) {
      try {
        const { error } = await this.supabaseClient
          .from('rsvps')
          .insert([{
            id: rsvpData.id,
            user_id: rsvpData.user_id,
            user_name: rsvpData.user_name,
            event_id: rsvpData.event_id,
            amount: rsvpData.amount,
            utr_number: rsvpData.utr_number,
            status: 'pending'
          }]);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error("Supabase RSVP Error:", err);
        return { success: false, message: err.message };
      }
    } else {
      const rsvps = JSON.parse(localStorage.getItem('wap_db_rsvps') || '[]');
      rsvps.push(rsvpData);
      localStorage.setItem('wap_db_rsvps', JSON.stringify(rsvps));
      return { success: true };
    }
  }

  async getRsvps(userId) {
    if (this.useSupabase) {
      try {
        const { data, error } = await this.supabaseClient
          .from('rsvps')
          .select('*')
          .eq('user_id', userId);
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase Get RSVPs Error:", err);
        return [];
      }
    } else {
      const rsvps = JSON.parse(localStorage.getItem('wap_db_rsvps') || '[]');
      return rsvps.filter(r => r.user_id === userId);
    }
  }
}

// Export database client instance to the window
window.WapDB = new DatabaseService();
