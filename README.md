# GHAS Seat Age Analysis

1. Clone this repository and install dependencies with `npm i`
2. Pull GHAS license `.csv` from StaffTools and put it in `/data`
3. Update `parser.js` to read the CSV file
4. Run the script with `npm start`
5. The results will be saved to `/results/pushes-by-date.csv`. Copy the results to your clipboard.
6. Open [the Google Sheet](https://docs.google.com/spreadsheets/d/1NbVSwkmyZy9T7TRx-zxmu0-5jAGBjlFw67yVNHkOJ5o/edit?usp=sharing) and paste the contents into cell A1.
7. With Column A selected, go to `Data -> Split text to columns` to parse the CSV.
8. The Chart should update to reflect your customer's license age distribution.

## Notes
This script also generates a chart SVG at `./results/chart.svg` that has the same data as what is generated in the Google Sheet, but is missing labels. Future work, contributions would be awesome!
