import difflib
import string
import time
import azure.cognitiveservices.speech as speechsdk


def pronunciation_assessment_continuous_from_file(filename, reference_text):
    """performs continuous speech recognition asynchronously with input from an audio file"""

    # Creates an instance of a speech config with specified subscription key and service region. Replace with your
    # own subscription key and service region (e.g., "westus"). Note: The pronunciation app feature is
    # currently only available on westus, eastasia and centralindia regions. And this feature is currently only
    # available on en-US language.

    speech_config = speechsdk.SpeechConfig(
        subscription='7515ea1573b64372b78acdaefea69c3b',
        region='eastus'
    )
    # mono WAV / PCM with a sampling rate of 16kHz
    audio_config = speechsdk.audio.AudioConfig(filename=filename)

    reference_text = reference_text
    # create pronunciation app config, set grading system, granularity and if enable miscue based on your
    # requirement.
    enable_miscue = True
    pronunciation_config = speechsdk.PronunciationAssessmentConfig(
        reference_text=reference_text,
        grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
        granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme,
        enable_miscue=enable_miscue
    )

    # Creates a speech recognizer using a file as audio input.
    # The default language is "en-us".
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    # apply pronunciation app config to speech recognizer
    pronunciation_config.apply_to(speech_recognizer)

    done = False
    recognized_words = []
    sentence_performance_dict = {}

    def stop_cb(evt):
        """callback that signals to stop continuous recognition upon receiving an event `evt`"""
        # print('CLOSING on {}'.format(evt))
        nonlocal done
        done = True

    def recognized(evt):
        pronunciation_result = speechsdk.PronunciationAssessmentResult(evt.result)

        nonlocal sentence_performance_dict
        sentence_performance_dict = {
            "accuracy": pronunciation_result.accuracy_score,
            "pronunciation": pronunciation_result.pronunciation_score,
            "completeness": pronunciation_result.completeness_score,
            "fluency": pronunciation_result.fluency_score
        }

        nonlocal recognized_words
        recognized_words += pronunciation_result.words

    # Connect callbacks to the events fired by the speech recognizer
    speech_recognizer.recognized.connect(recognized)
    speech_recognizer.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
    speech_recognizer.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
    speech_recognizer.canceled.connect(lambda evt: print('CANCELED {}'.format(evt)))
    # stop continuous recognition on either session stopped or canceled events
    speech_recognizer.session_stopped.connect(stop_cb)
    speech_recognizer.canceled.connect(stop_cb)

    # Start continuous pronunciation app
    speech_recognizer.start_continuous_recognition()
    while not done:
        time.sleep(.5)

    speech_recognizer.stop_continuous_recognition()

    # For continuous pronunciation app mode, the service won't return the words with `Insertion` or `Omission`
    # even if miscue is enabled. We need to compare with the reference text after received all recognized words to
    # get these error words.
    if enable_miscue:
        # we need to convert the reference text to lower case, and split to words, then remove the punctuations.
        reference_words = [w.strip(string.punctuation) for w in reference_text.lower().split()]
        diff = difflib.SequenceMatcher(None, reference_words, [x.word for x in recognized_words])
        final_words = []
        for tag, i1, i2, j1, j2 in diff.get_opcodes():
            if tag == 'insert':
                for word in recognized_words[j1:j2]:
                    if word.error_type == 'None':
                        word._error_type = 'Insertion'
                    final_words.append(word)
            elif tag == 'delete':
                for word_text in reference_words[i1:i2]:
                    word = speechsdk.PronunciationAssessmentWordResult({
                        'Word': word_text,
                        'PronunciationAssessment': {
                            'ErrorType': 'Omission',
                        }
                    })
                    final_words.append(word)
            else:
                final_words += recognized_words[j1:j2]
    else:
        final_words = recognized_words

    word_performance_list = []
    for idx, word in enumerate(final_words):
        word_performance_list.append({
            "word": word.word,
            "accuracy": word.accuracy_score,
            "error_type": word.error_type
        })

    return {
        "sentence_performance": sentence_performance_dict,
        "word_performance": word_performance_list
    }
