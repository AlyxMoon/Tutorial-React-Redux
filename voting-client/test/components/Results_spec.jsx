import React from 'react';
import ReactDOM from 'react-dom';
import {
    renderIntoDocument,
    scryRenderedDOMComponentsWithClass,
    Simulate
} from 'react-addons-test-utils';
import {List, Map} from 'immutable';
import {Results} from '../../src/components/Results';
import {expect} from 'chai';

describe('Results', () => {

    it('displays current round number', () => {
        let round = 2;
        const component = renderIntoDocument(
            <Results    pair = {List()}
                        tally = {Map()}
                        round = {round} />
        );
        const roundNumber = scryRenderedDOMComponentsWithClass(component, 'round')[0];

        expect(roundNumber.textContent).to.contain('2');
    });

    it('renders entries with vote counts or zero', () => {
        const pair = List.of('Trainspotting', '28 Days Later');
        const tally = Map({'Trainspotting': 5});
        const component = renderIntoDocument(
            <Results pair={pair} tally={tally} />
        );
        const entries = scryRenderedDOMComponentsWithClass(component, 'entry');
        const [train, days] = entries.map(e => e.textContent);

        expect(entries.length).to.equal(2);
        expect(train).to.contain('Trainspotting');
        expect(train).to.contain('5');
        expect(days).to.contain('28 Days Later');
        expect(days).to.contain('0');
    });

    it('invokes the next callback when next button is clicked', () => {
        let nextInvoked = false;
        const next = () => nextInvoked = true;

        const pair = List.of('Trainspotting', '28 Days Later');
        const component = renderIntoDocument(
            <Results    pair = {pair}
                        tally = {Map()}
                        next = {next} />
        );
        Simulate.click(ReactDOM.findDOMNode(component.refs.next));

        expect(nextInvoked).to.equal(true);
    });

    it('invokes the restart callback when restart button is clicked', () => {
        let restartInvoked = false;
        const restart = () => restartInvoked = true;

        const pair = List.of('Trainspotting', '28 Days Later');
        const component = renderIntoDocument(
            <Results    pair = {pair}
                        tally = {Map()}
                        restart = {restart} />
        );
        Simulate.click(ReactDOM.findDOMNode(component.refs.restart));

        expect(restartInvoked).to.equal(true);
    });

    it('renders the winner when there is one', () => {
        const component = renderIntoDocument(
            <Results    winner = "Trainspotting"
                        pair = {["Trainspotting", "28 Days later"]}
                        tally = {Map()} />
        );
        const winner = ReactDOM.findDOMNode(component.refs.winner);
        expect(winner).to.be.ok;
        expect(winner.textContent).to.contain('Trainspotting');
    });

});