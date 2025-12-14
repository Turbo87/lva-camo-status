mod aircraft;
mod fetch;
mod parse;
mod render;

use std::fs;

use aircraft::{AIRCRAFT, Aircraft, Club};
use render::AircraftStatus;

fn main() {
    let statuses: Vec<AircraftStatus> = AIRCRAFT
        .iter()
        .map(fetch_and_parse)
        .collect();

    let lva: Vec<_> = statuses
        .iter()
        .filter(|s| {
            AIRCRAFT
                .iter()
                .find(|a| a.callsign == Some(s.callsign.as_str()))
                .map(|a| a.club == Club::Lva)
                .unwrap_or(false)
        })
        .cloned()
        .collect();

    let nordstern: Vec<_> = statuses
        .iter()
        .filter(|s| {
            AIRCRAFT
                .iter()
                .find(|a| a.callsign == Some(s.callsign.as_str()))
                .map(|a| a.club == Club::Nordstern)
                .unwrap_or(false)
        })
        .cloned()
        .collect();

    let html = render::render_html(&lva, &nordstern).expect("Failed to render HTML");

    fs::write("index.html", html).expect("Failed to write index.html");
    println!("Generated index.html");
}

fn fetch_and_parse(aircraft: &Aircraft) -> AircraftStatus {
    let html = match fetch::fetch_status_html(aircraft.id) {
        Ok(html) => html,
        Err(e) => {
            eprintln!("Failed to fetch status for {}: {e}", aircraft.id);
            return AircraftStatus {
                callsign: aircraft.callsign.unwrap_or("Unknown").to_string(),
                aircraft_type: aircraft.aircraft_type.unwrap_or("Unknown").to_string(),
                status: "error".to_string(),
            };
        }
    };

    let parsed = match parse::parse_status_html(&html) {
        Ok(parsed) => parsed,
        Err(e) => {
            eprintln!("Failed to parse status for {}: {e}", aircraft.id);
            return AircraftStatus {
                callsign: aircraft.callsign.unwrap_or("Unknown").to_string(),
                aircraft_type: aircraft.aircraft_type.unwrap_or("Unknown").to_string(),
                status: "error".to_string(),
            };
        }
    };

    let callsign = aircraft
        .callsign
        .map(|s| s.to_string())
        .unwrap_or(parsed.easa_variant.clone());

    let aircraft_type = aircraft.aircraft_type.map(|s| s.to_string()).unwrap_or({
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
