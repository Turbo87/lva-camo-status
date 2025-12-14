mod aircraft;
mod fetch;
mod parse;
mod render;

use std::collections::BTreeMap;
use std::fs;

use aircraft::{Aircraft, load_aircraft};
use render::{AircraftStatus, ClubStatus};

fn main() {
    let aircraft_list = load_aircraft();
    let mut clubs_map: BTreeMap<&str, Vec<AircraftStatus>> = BTreeMap::new();

    for aircraft in &aircraft_list {
        let status = fetch_and_parse(aircraft);
        clubs_map.entry(&aircraft.club).or_default().push(status);
    }

    let clubs: Vec<ClubStatus> = clubs_map
        .into_iter()
        .map(|(name, aircraft)| ClubStatus {
            name: name.to_string(),
            aircraft,
        })
        .collect();

    let rendered_at = chrono::Utc::now().format("%Y-%m-%d %H:%M UTC").to_string();
    let html = render::render_html(&clubs, &rendered_at).expect("Failed to render HTML");

    fs::write("index.html", html).expect("Failed to write index.html");
    println!("Generated index.html");
}

fn fetch_and_parse(aircraft: &Aircraft) -> AircraftStatus {
    let html = match fetch::fetch_status_html(&aircraft.id) {
        Ok(html) => html,
        Err(e) => {
            eprintln!("Failed to fetch status for {}: {e}", aircraft.id);
            return AircraftStatus {
                callsign: aircraft.callsign.clone().unwrap_or("Unknown".to_string()),
                aircraft_type: aircraft.aircraft_type.clone().unwrap_or("Unknown".to_string()),
                status: "error".to_string(),
            };
        }
    };

    let parsed = match parse::parse_status_html(&html) {
        Ok(parsed) => parsed,
        Err(e) => {
            eprintln!("Failed to parse status for {}: {e}", aircraft.id);
            return AircraftStatus {
                callsign: aircraft.callsign.clone().unwrap_or("Unknown".to_string()),
                aircraft_type: aircraft.aircraft_type.clone().unwrap_or("Unknown".to_string()),
                status: "error".to_string(),
            };
        }
    };

    let callsign = aircraft
        .callsign
        .clone()
        .unwrap_or(parsed.easa_variant.clone());

    let aircraft_type = aircraft.aircraft_type.clone().unwrap_or({
        if parsed.easa_type == parsed.easa_variant {
            parsed.easa_type
        } else {
            format!("{} {}", parsed.easa_type, parsed.easa_variant)
        }
    });

    let status = match parsed.camo.as_str() {
        "airworthy" => "airworthy",
        "grounded" => "grounded",
        "prewarning" => "prewarning",
        _ => "unknown",
    };

    AircraftStatus {
        callsign,
        aircraft_type,
        status: status.to_string(),
    }
}
