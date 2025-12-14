#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Club {
    Lva,
    Nordstern,
}

#[derive(Debug, Clone)]
pub struct Aircraft {
    pub id: &'static str,
    pub callsign: Option<&'static str>,
    pub aircraft_type: Option<&'static str>,
    pub club: Club,
}

pub const AIRCRAFT: &[Aircraft] = &[
    // LVA
    Aircraft {
        id: "2Nr6sRxrj",
        callsign: Some("D-3886"),
        aircraft_type: Some("Astir"),
        club: Club::Lva,
    },
    Aircraft {
        id: "rACy6WHR",
        callsign: Some("D-1108"),
        aircraft_type: Some("LS 4"),
        club: Club::Lva,
    },
    Aircraft {
        id: "2PQn9CjUB",
        callsign: Some("D-0628"),
        aircraft_type: Some("LS 8"),
        club: Club::Lva,
    },
    Aircraft {
        id: "2wesNRmGV",
        callsign: Some("D-KBBQ"),
        aircraft_type: Some("Duo Discus XLT"),
        club: Club::Lva,
    },
    Aircraft {
        id: "2JRWNcNfX",
        callsign: Some("D-KUFP"),
        aircraft_type: Some("HK36 Super Dimona"),
        club: Club::Lva,
    },
    // Nordstern
    Aircraft {
        id: "2LWzettan",
        callsign: Some("D-5074"),
        aircraft_type: Some("ASK 21"),
        club: Club::Nordstern,
    },
    Aircraft {
        id: "2o8VgT3ML",
        callsign: Some("D-0578"),
        aircraft_type: Some("LS 4"),
        club: Club::Nordstern,
    },
    Aircraft {
        id: "bmknou8D",
        callsign: Some("D-5424"),
        aircraft_type: Some("Ka 6"),
        club: Club::Nordstern,
    },
];
